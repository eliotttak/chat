import $ from "jquery";
console.log("test");

let dontSendUnconnectNotifsVar = false;

export const dontSendUnconnectNotifs = (b?: boolean): boolean | undefined =>
  b === undefined
    ? dontSendUnconnectNotifsVar
    : void (dontSendUnconnectNotifsVar = b);

export let $okPseudoBtn = $("#okpseudo");
export let $usernameInput = $("#inputpseudo");
let usernameVar: string;
export const username = (u?: string): string | undefined =>
  u === undefined ? usernameVar : void (usernameVar = u);

let page = 0;
let inputError: any;
export const debug = /debug=true/.test(location.search);

if (debug) {
  debugger;
  console.log($);
}
const pause = async (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

const putErrorUnderTextInput = (
  input: JQuery<HTMLElement>,
  settings: {
    txt?: string;
    color?: string;
    showTime?: number;
  } = {},
): JQuery<HTMLElement> => {
  if (debug) debugger;

  const txt = settings.txt ?? "Veuillez respecter le format";
  const color = settings.color ?? "#FF0000";
  const showTime = settings.showTime ?? Infinity;

  const width = input.width() ?? 0;
  const height = input.height() ?? 0;
  const top = input.offset()?.top ?? 0;
  const left = input.offset()?.left ?? 0;

  let newSpan = $("<span>", {
    id: `error-under-input-${input.attr("id")}`,
  })
    .css("position", "absolute")
    .css("top", top + height + 5 + "px")
    .css("left", left + "px")
    .css("width", width + "px")
    .css("color", color)
    .css("font-size", "15px")
    .css("align", "center")
    .html(txt);

  input.parent().append(newSpan);

  if (showTime !== Infinity) setTimeout(newSpan.remove, showTime);

  return newSpan;
};
