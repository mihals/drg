import { lvlNames } from "./enums";
import { GameState } from "./enums";
import { LvlState } from "./enums";
import { UIBlocks } from "./uiblocks";
import * as Phaser from "phaser";
declare global{
     var gYsdk;
     var gPlayer;
     var lang: string;
     var currentLevel: lvlNames;
     var currentResult: GameState;
     var achievments: Array<LvlState>;
     var myUIBlocks:UIBlocks;
     var currentScene:Phaser.Scene;
     var currentSceneName:string;
}
export {}