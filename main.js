chrome.input.ime.onActivate.addListener(() => {
  chrome.storage.local.set({ "on": true });
});

chrome.input.ime.onDeactivated.addListener(() => {
  chrome.storage.local.set({ "on": false });
});

chrome.commands.onCommand.addListener(async (command) => {
  // Only attempt to send events when we're the active IME.
  const { on } = await chrome.storage.local.get(["on"]);
  if (!on) {
    return;
  }

  const keyData = {};
  keyData.key = "";
  keyData.code = command === "vol-up" ? "VolumeUp" : "VolumeDown";

  // Simulate press then unpress.
  keyData.type = "keydown";
  chrome.input.ime.sendKeyEvents({"contextID": 0, "keyData": [keyData]});
  keyData.type = "keyup";
  chrome.input.ime.sendKeyEvents({"contextID": 0, "keyData": [keyData]});
});
