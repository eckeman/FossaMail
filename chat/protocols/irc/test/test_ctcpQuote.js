/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

Components.utils.import("resource://gre/modules/Services.jsm");
let irc = {};
Services.scriptloader.loadSubScript("resource:///components/irc.js", irc);

const input = [
  "", 
  "test",
  "\\test",
  "te\\st",
  "test\\",
  "\\\\test",
  "te\\\\st",
  "test\\\\",
  "\\\\\\test",
  "te\\\\\\st",
  "test\\\\\\",
  "\x01test",
  "te\x01st",
  "test\x01",
  "\\\\\x01test",
  "\\\\atest"
];

const expectedOutputCommand = "PRIVMSG";

const expectedOutputParams = [
  "ACTION",
  "ACTION test",
  "ACTION \\\\test",
  "ACTION te\\\\st",
  "ACTION test\\\\",
  "ACTION \\\\\\\\test",
  "ACTION te\\\\\\\\st",
  "ACTION test\\\\\\\\",
  "ACTION \\\\\\\\\\\\test",
  "ACTION te\\\\\\\\\\\\st",
  "ACTION test\\\\\\\\\\\\",
  "ACTION \\atest",
  "ACTION te\\ast",
  "ACTION test\\a",
  "ACTION \\\\\\\\\\atest",
  "ACTION \\\\\\\\atest"
];

let outputParams = [];

irc.ircAccount.prototype.sendMessage = function(aCommand, aParams) {
  do_check_eq(expectedOutputCommand, aCommand);
  outputParams.push(aParams[1]);
}

function run_test() {
  let output = input.map(function(aStr)
    irc.ircAccount.prototype.sendCTCPMessage("ACTION", aStr, ""));

  // Ensure both arrays have the same length.
  do_check_eq(expectedOutputParams.length, outputParams.length);
  // Ensure the values in the arrays are equal.
  for (let i = 0; i < outputParams.length; ++i)
    do_check_eq("\x01" + expectedOutputParams[i] + "\x01", outputParams[i]);
}
