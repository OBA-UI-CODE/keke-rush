import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";

const port = 4179;
const url = `http://127.0.0.1:${port}`;
const edge = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const vite = spawn(process.execPath, ["node_modules/vite/bin/vite.js", "--host", "127.0.0.1", "--port", String(port)], { stdio: ["ignore", "pipe", "pipe"] });

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt++) {
    try { if ((await fetch(url)).ok) return; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Vite did not become ready");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

let browser;
try {
  await waitForServer();
  browser = await chromium.launch({ executablePath: edge, headless: true, args: ["--use-angle=swiftshader", "--disable-background-timer-throttling", "--disable-renderer-backgrounding", "--disable-backgrounding-occluded-windows"] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error" && !message.text().includes("Failed to load resource")) errors.push(message.text()); });
  page.on("response", (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto(url, { waitUntil: "networkidle" });
  assert(await page.title() === "Keke Rush — Isolo to Ikotun", "Unexpected page title");
  assert(await page.locator("#game").isVisible(), "WebGL canvas is not visible");

  await page.locator("#start-button").click();
  assert((await page.locator("#name-error").textContent())?.includes("Give your driver"), "Empty driver name was accepted");
  await page.locator("#player-name").fill("Tolu");
  await page.locator("#start-button").click();
  await page.locator("#hud").waitFor({ state: "visible" });
  assert(await page.locator("#character-badge").isVisible(), "Recognized character badge did not appear");
  assert(await page.evaluate(() => Boolean(localStorage.getItem("keke-rush-character-v1"))), "Character was not persisted");
  await page.evaluate(() => document.querySelector("#sound-button")?.click());
  assert((await page.locator("#sound-button").getAttribute("aria-label")) === "Enable sound", "Sound did not mute");
  await page.evaluate(() => document.querySelector("#sound-button")?.click());

  await page.keyboard.down("w");
  await page.waitForTimeout(150);
  const drivingState = await page.evaluate(() => window.__kekeRushTest?.getState());
  assert(drivingState?.keys.includes("KeyW"), "Accelerate input was not registered");
  await page.keyboard.up("w");
  await page.keyboard.press("KeyP");
  assert(await page.locator("#pause-screen").isVisible(), "Pause screen did not open");
  await page.locator("#resume-button").click();

  for (let index = 0; index < 3; index++) {
    const hookAvailable = await page.evaluate((stopIndex) => { window.__kekeRushTest?.boardAtStop(stopIndex); return Boolean(window.__kekeRushTest); }, index);
    assert(hookAvailable, "Development gameplay test hook is unavailable");
    assert((await page.locator("#seat-count").textContent())?.startsWith(String(index + 1)), `Passenger ${index + 1} did not board`);
  }
  await page.evaluate(() => window.__kekeRushTest?.placeAtFinish());
  await page.locator("#result-screen").waitFor({ state: "visible" });
  assert((await page.locator("#result-title").textContent()) === "Ikotun reached!", "Valid full-passenger finish failed");
  assert((await page.locator("#result-leaderboard").textContent())?.includes("Tolu"), "Completed run was not added to the leaderboard");
  await page.locator("#restart-button").click();
  await page.locator("#hud").waitFor({ state: "visible" });
  assert((await page.locator("#ghost-status").textContent())?.toLowerCase().includes("ghost"), "Saved ghost was not loaded");

  await mkdir("test-results", { recursive: true });
  await page.screenshot({ path: "test-results/keke-rush-complete.png", fullPage: true });
  assert(errors.length === 0, `Browser errors: ${errors.join(" | ")}`);
  process.stdout.write("E2E passed: start → drive → pause → 3 pickups → valid finish → ghost reload\n");
} finally {
  await browser?.close();
  vite.kill();
}
