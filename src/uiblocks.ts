//import { startGame } from "./game";
import { GameState, lvlNames, LvlState } from "./enums";
import { numMsg } from "./enums";

type phrases = {
    gameName:string,
    tutorWinFirstTime : string,
    tutorWinAnother : string,
    capSummaryWin : string,
    capSummaryLost,
    bodySummary : string,
    destEnemy : string,
    spentAmmo : string,
    effectiv : string,
    effectivTail : string,
    demoBtn : string,
    lonerBtn : string,
    twoGunsBtn : string,
    demoFBtn : string,
    forestBtn : string,
    everyLast : string,

    bodyContent : Array<string>,
    bodyMsg :{
        tutorWinFirstTime:string,
        tutorWinAnother:string
    } 
}

const ruPhrases : phrases = {
    gameName: "Вражьи тропы.",
    tutorWinFirstTime: "Отлично! Вы прошли уровень 'Учебка'.",
    tutorWinAnother: "Вы прошли уровень 'Учебка'.",
    capSummaryWin : "Враг уничтожен полностью!",
    capSummaryLost : "Враг прорвался...",
    bodySummary: "Если Вам непонятны правила или управление, жмите кнопку 'Учебка.', " +
    "если всё понятно - кнопку 'Одиночка' - это тот же уровень, но без презентации. "+
    "Пройдите его чтобы получить свою первую звезду, и у вас появится напарник-бот " +
    "для игры 'В два ствола'. Удачи!",
    
    destEnemy : "Уничтожено врагов: ",
    spentAmmo : "Потрачено патронов: ",
    effectiv : "Эффективность: ",
    effectivTail : " патронов на врага.",

    demoBtn : "Учебка.",
    lonerBtn : "Одиночка.",
    twoGunsBtn : "В два ствола.",
    demoFBtn : "В лесу.",
    forestBtn : "Оборона.",
    everyLast : "До последнего.",

    bodyContent : ["Если Вам непонятны правила или управление, жмите кнопку 'Учебка.', " +
    "если всё понятно - кнопку 'Одиночка'. "+
    "Пройдите его чтобы получить свою первую звезду, и у вас появится напарник-бот " +
    "для игры 'В два ствола'. Удачи!",

    "Пройдите уровень 'Одиночка' чтобы получить свою первую звезду, и у вас появится напарник-бот " +
    "для игры 'В два ствола'. Удачи!",

    " Превосходно! Вы получаете свою первую звезду и у Вас теперь есть напарник- Чёрный Бот, " + 
    "с которым Вы можете пройти уровень 'В два ствола'." +
    " Бот будет пытаться повторять все ваши действия на только что пройденном уровне." +
    " Если Вы захотите заменить бота, пройдите этот уровень ещё раз.",

    "Вы ещё раз прошли этот уровень и теперь у Вас новый напарник-бот, который будет"+
    " пытаться повторять все ваши действия на только что пройденном уровне." +
    " Если Вы захотите заменить бота, пройдите этот уровень ещё раз.",

    " Пока не получилось, но впереди Вас ждёт успех! Пройдите этот уровень чтобы получить"+
    " свою первую звезду, и у вас появится напарник-бот для игры 'В два ствола'. Удачи!"+
    " Бот будет пытаться повторять все ваши действия на пройденном уровне.",

    " Немного не повезло. Но если Вы хотите заменить своего бота, Вам придётся пройти"+
    " этот уровень ещё раз. Удачи!",

    "Пройдите уровень 'Учебка', чтобы ознакомиться с правилами и управлением.",
    
    " Пройдите уровень 'В два ствола' с напарником - Чёрным Ботом, " + 
    " который будет пытаться повторять все ваши действия на уровне 'Одиночка'." +
    " Если Вы захотите заменить бота, пройдите уровень 'Одиночка' ещё раз.",

    "Пройдите учебный уровень 'В лесу.', чтобы познакомиться с новой локацией.",

    "Уничтожьте тысячу врагов, чтобы пройти уровень 'Оборона'. Вам даётся на это "+
    "200 патронов и добавляется 15 за каждые 10 уничтоженных врагов. "+
    "Пройдите его, чтобы получить третью звезду.",

    "Выберите уровень для прохождения."],

    bodyMsg :{
        //** сообщение при впервые пройденной Учебке */
        tutorWinFirstTime : "Пройдите уровень 'Одиночка.' чтобы получить свою первую "+
        "звезду, и у вас появится напарник - Чёрный Бот для игры 'В два ствола'. Удачи!",
        //** сообщение при повторно пройденной Учебке */
        tutorWinAnother : "Если Вам нужно заменить Чёрного Бота, пройдите уровень "+
        "'Одиночка.' ещё раз и у Вас появится другой напарник."
    }
} 

const enPhrases : phrases = {
    gameName:"Enemies is coming.",
    tutorWinFirstTime: "Congratulation! Level 'Tutorial' completed.",
    tutorWinAnother: "Level 'Tutorial' completed.",
    capSummaryWin : "The enemy has been completely terminated!",
    capSummaryLost : "The enemy has passed...",
    bodySummary: "If you do not understand the rules or control, click the 'Demo.' "+
    "button, if everything is clear, click 'Loner' button. Go through it to get your first star, and you will have a bot "+
    "partner for a two-gun level. Good luck!",
    destEnemy : "Destroyed enemies: ",
    spentAmmo : "Spent ammo: ",
    effectiv : "Effectiveness: ",
    effectivTail: " ammo per enemy.",
    
    demoBtn : "Demo",
    lonerBtn : " Loner ",
    twoGunsBtn : " Two gun ",
    demoFBtn: "The forest.",
    forestBtn: "Defense.",
    everyLast: "Every last.",

    bodyContent : ["If you do not understand the rules or control, click the 'Demo.' "+
    "button, if everything is clear, click 'Loner' button, it is the same level, but without "+
    "presentation. Go through it to get your first star, and you will have a bot "+
    "partner for a two-gun level. Good luck!",
    "Complete the 'Loner' level to get your first star, and you will have a partner-bot " +
    " for playing 'Two guns' level. Good luck!",
    "Excellent! You get your first star and you now have a bot partner," +
    "with which you can complete the level 'Two guns'." +
    " The bot will try to repeat all your actions on the level you just passed." +
    " If you want to replace the bot, go through this level again.",
    "You have completed this level once again and now you have a new bot partner who will "+
    " try to repeat all your actions on the level you just passed." +
    " If you want to replace the bot, go through this level again.",
    " It has not worked out yet, but success awaits you ahead! Complete this level to get"+
    "your first star, and you will have a partner-a bot for the game 'Two gun'. Good luck!"+
    " The bot will try to repeat all your actions at the completed level.",
    "A little unlucky. But if you want to replace your bot, you will have to go through the "+
    " this level again. Good luck!",
    "Complete the 'Demo' level to familiarize yourself with the rules and control.",
    "Complete the level 'Two guns' with a Black Bot partner, " + 
    " which will try to repeat all your actions at the 'Loner' level." +
    " If you want to replace the bot, go through the 'Loner' level again.",
    "Complete the training level 'In the forest.'to get to know the new location.",
    "Kill a thousand enemies to complete the 'Defense' level. You are given "+
    " 200 bullets for this and 15 are added for every 10  enemies killed. "+
    "Pass it to get the third star.",
    "Select a level to complete."],

    bodyMsg :{
        tutorWinFirstTime : "Click 'Loner' to go through it to get your first star, " +
        "and you will have a Black Bot partner for a two-gun level. Good luck!",
        tutorWinAnother : "If you need to replace the Black Bot, complete the "+
        " 'Loner' level one more time and you'll have another partner."
    }
} 

export class UIBlocks {
    lang: string;
    myPhrases: phrases;

    constructor() {
        if (globalThis.lang == "en") {
            this.myPhrases = enPhrases;
        } else {
            this.myPhrases = ruPhrases
        }

        let numStars  = 0;
        for(let i=0; i< globalThis.achievments.length; i++){
            if((globalThis.achievments[i] == 1) && (i!=0) && (i!=3)){
                numStars++;
            }
        }
        globalThis.numStars =numStars;
    }

    /** вставляет в контейнер id="modalContainer" базовое окно с перечнем всех уровней */
    showBaseWnd(achievments:Array<LvlState>,lang:string){
        document.getElementById("modalContainer").innerHTML = "";
        
        //ниже семь строчек для тестирования, для продакта раскомментировать
        //следующие две строчки
        let locAchievments = achievments;
        let locLang = lang;
        let locNumStars  = 0;
        let content:string; 

        this.myPhrases = locLang == "en"? enPhrases : ruPhrases;
        
        /**вычисляем количество звёзд */
        for(let i=0; i< locAchievments.length; i++){
            if((locAchievments[i] == 1) && (i!=0) && (i!=3)){
                locNumStars++;
            }
        }

        /** наименьший непройденный уровень */
        let firstUncompleted = 5;
        for(let i=0; i< locAchievments.length; i++){
            if(locAchievments[i] != 1) {
                firstUncompleted = i;
                break;
            }
        }

        switch (firstUncompleted) {
            case 0:
                content = this.myPhrases.bodyContent[6];
                break;
            case 1:
                content = this.myPhrases.bodyContent[0];
                break;
            case 2:
                content = this.myPhrases.bodyContent[7];
                break;
            case 3:
                content = this.myPhrases.bodyContent[8];
                break;
            case 4:
                content = this.myPhrases.bodyContent[9];
                break;
            case 5:
                content = this.myPhrases.bodyContent[10];
                break;
        }
        
        

        // if(locAchievments[2] == 0) content = this.myPhrases.bodyContent[1];
        // if(locAchievments[1] == -1) content = this.myPhrases.bodyContent[0];
        // if(locAchievments[1] == 0) content = this.myPhrases.bodyContent[1];
        
        

        let modalWnd = `
        <div id="modalWnd">
        <div id="summaryTop">
          <p>${this.myPhrases.gameName}</p>
        </div>
        <div id="summaryResult">
          <div style="margin: 5px;"><img src="pogon`+locNumStars+
          `.png" class="pogonImg"></div>
          <div  id="summaryMsg" >
            ${content}
          </div>
        </div>
        <div style="display: flex; flex-direction: row; justify-content: space-around;">
          <div style="align-self: center;">
            <button class="lvlBottom" onclick="MyGame.startLevel('demo')">
              ${this.myPhrases.demoBtn}</button>
          </div>
          <div style="align-self: center;">
            <button class="lvlBottom" onclick="MyGame.startLevel('loner')"`
            + (locAchievments[0] != 1? " disabled":"") + `>
              ${this.myPhrases.lonerBtn}</button>
          </div>
          <div style="align-self: center;">
            <button class="lvlBottom" onclick="MyGame.startLevel('twoGuns')"`
            + (locAchievments[1] != 1? " disabled":"") + `>
              ${this.myPhrases.twoGunsBtn}</button>
          </div>
        </div>
        <div style="display: flex; flex-direction: row; justify-content: space-around;">
          <div style="align-self: center;">
            <button class="lvlBottom" onclick="MyGame.startLevel('demoF')"`
            + (locAchievments[2] < 1? " disabled":"") + `>
              ${this.myPhrases.demoFBtn}</button>
          </div>
          <div style="align-self: center;">
            <button class="lvlBottom" onclick="MyGame.startLevel('forest')"`
            + (locAchievments[3] < 1? " disabled":"") + `>
              ${this.myPhrases.forestBtn}</button>
          </div>
        </div>
      </div>`

        document.getElementById("modalContainer").innerHTML = modalWnd;
        document.getElementById("modalContainer").style.visibility = "visible";
        document.getElementById("modalContainer").style.display = "flex";

        //document.getElementById("modalContainer").style.zoom = 0.3;
    }

    /** вставляет в контейнер набор кнопок с уровнями */
    showLevelsMenu(lang: string, lvlsAchives) {
        let content: string
        if (lang !== "ru") {
            content =
                `<div id="levelWnd">
                <div id = "topLevelWnd">
                    <img src="pogon.png" class="pogonImg">
                    <p>ljdf[aligjoaagj] kdsfpoeurypormh [pgkp[ajoipajt]a</p>
                </div>
                <div id = "bottomLevelWnd">
                    <div><button class="lvlBottom" id="tutorBtn" onclick="MyGame.hideLevelsMenu('en',0)">Training.</button></div>
                    <div><button ` + (lvlsAchives[1] == -1 ? "disabled" : "") + ` class="lvlBottom" id="aloneBtn"  onclick="MyGame.hideLevelsMenu('en',1)" >Alone.</button></div>
                    <div><button ` + (lvlsAchives[2] == -1 ? "disabled" : "") + ` class="lvlBottom" id="twoGunBtn" onclick="MyGame.hideLevelsMenu('en',2)">From two guns.</button></div>
                    <input type="button" class="lvlBottom"   value="Заглушка."  >
                </div>
            </div>`
            document.getElementById("modalContainer").innerHTML = content;
            document.getElementById("modalContainer").style.visibility = "visible";
            document.getElementById("modalContainer").style.display = "flex"
        }
        else {
            content =
                `<div id="levelWnd">
                <div id = "topLevelWnd">
                    <img src="pogon.png" class="pogonImg">
                    <p>ljdf[aligjoaagj] kdsfpoeurypormh [pgkp[ajoipajt]a</p>
                </div>
                <div id = "bottomLevelWnd">
                    <div><button class="lvlBottom" id="tutorBtn" onclick="MyGame.hideLevelsMenu('en',0)">Учебка.</button></div>
                    <div><button ` + (lvlsAchives[1] == -1 ? "disabled" : "") + ` class="lvlBottom" id="aloneBtn"  onclick="MyGame.hideLevelsMenu('en',1)" >Одиночка.</button></div>
                    <div><button ` + (lvlsAchives[2] == -1 ? "disabled" : "") + ` class="lvlBottom" id="twoGunBtn" onclick="MyGame.hideLevelsMenu('en',2)">В два ствола.</button></div>
                    <input type="button" class="lvlBottom"   value="Заглушка."  >
                </div>
            </div>`
            document.getElementById("modalContainer").innerHTML = content;
            document.getElementById("modalContainer").style.visibility = "visible";
            document.getElementById("modalContainer").style.display = "flex"
        }
    }

    /** обрабатывает нажатие кнопки уровня и удаляет окно с кнопками с уровнями
     * и скрывает контейнер для модальных окон
     */
    hideModal() {
        //startGame()
        document.getElementById("modalContainer").innerHTML = ""
        // document.getElementById("modalContainer").innerHTML = "";
         document.getElementById("modalContainer").style.visibility = "hidden";
         document.getElementById("modalContainer").style.display = "none"
    }

    /** выводит итоговое окно с результатами пройденного уровня
     * @numBullets число потраченных патронов
     * @numEnemies число уничтоженных врагов
     * @result результат игры
     * @numMsg номер сообщения в окне
     */
    showSummary(numBullets: number, numEnemies: number, result: GameState) {
        document.getElementById("modalContainer").innerHTML = "";
        let lang = globalThis.lang;
        let content;
        /** сообщение - призыв продолжить игру */
        let bodySummary;
        this.myPhrases = globalThis.lang == "en" ? enPhrases : ruPhrases;
        /** текст в заголовке о результате - пройден или нет уровень */
        let summaryTopTxt:string;
        /** разметка для левой и правой кнопок */
        let leftBtn:string;
        let rightBtn:string;
        /** надписи для левой и правой кнопок */
        let leftBtnTxt:string;
        let rightBtnTxt:string;

        // преобразованный в JSON строку массив achievments
        let lvlsDataStr:string;
        

        switch (globalThis.currentSceneName) {
            case lvlNames.Demo:
                if (result == GameState.Win) {
                    // если уровень 'Учебка' пройден впервые
                    if (globalThis.achievments[0] != 1) {
                        globalThis.achievments[0] = 1;
                        lvlsDataStr = JSON.stringify(globalThis.achievments)

                        try {
                            globalThis.gPlayer.setData({ lvlsData: lvlsDataStr }).
                                then(() => { });
                        } catch (err) { }

                        try {
                            localStorage.setItem("lvlsData", lvlsDataStr)
                        } catch (err) { }

                        summaryTopTxt = lang == "ru" ? "Вы прошли уровень 'Учебка'." :
                            "Congratulation! Level 'Tutorial' completed.";

                        bodySummary = lang == "ru" ? "Пройдите уровень 'Одиночка' чтобы " +
                            "получить свою первую звезду, и у вас появится напарник-бот " +
                            "для игры 'В два ствола'. Удачи!" :
                            "Complete the 'Loner' level to get your first star, and you will " +
                            "have a partner-bot for playing 'Two gun' level. Good luck!";

                        leftBtnTxt = lang == "ru" ? "Продолжить." : "Continue.";

                        leftBtn = `<button class="lvlBottom" onclick="MyGame.startLevel('loner')">
                            ${leftBtnTxt}</button>`;

                        rightBtnTxt = lang == "ru" ? "Отмена." : "Cancel.";

                        rightBtn = `<button class="lvlBottom" onclick=` +
                            `"globalThis.myUIBlocks.showBaseWnd(globalThis.achievments,globalThis.lang)">
                            ${rightBtnTxt}</button>`;


                    }
                    // если уровень  'Учебка' уже был пройден ранее, то ничего не меняем в lvlsData
                    else {
                        summaryTopTxt = lang == "ru" ? "Вы прошли уровень 'Учебка'." :
                            "Level 'Tutorial' completed.";
                        // если следующий уровень "Одиночка" уже пройден
                        if (globalThis.achievments[1] == 1) {
                            bodySummary = lang == "ru" ? " Если Вы захотите заменить бота, " +
                                "пройдите уровень 'Одиночка' ещё раз." :
                                "If you need to replace the Black Bot, complete the " +
                                " 'Loner' level one more time and you'll have another partner.";
                        }
                        // если следующий уровень "Одиночка" ещё не проходился
                        else {
                            bodySummary = lang == "ru" ? "Пройдите уровень 'Одиночка' чтобы " +
                                "получить свою первую звезду, и у вас появится напарник-бот " +
                                "для игры 'В два ствола'. Удачи!" :
                                "Complete the 'Loner' level to get your first star, and you will " +
                                "have a partner-bot for playing 'Two gun' level. Good luck!";
                        }

                        leftBtnTxt = lang == "ru" ? "Продолжить." : "Continue.";

                        leftBtn = `<button class="lvlBottom" onclick="MyGame.startLevel('loner')">
                            ${leftBtnTxt}</button>`;

                        rightBtnTxt = lang == "ru" ? "Отмена." : "Cancel.";

                        rightBtn = `<button class="lvlBottom" onclick=` +
                            `"globalThis.myUIBlocks.showBaseWnd(globalThis.achievments,globalThis.lang)">
                            ${rightBtnTxt}</button>`;
                    }
                }
                // если попытка пройти "Учебка" неудачна
                else {
                    summaryTopTxt = lang == "ru" ? "Уровень не пройден." :
                        "The level is not passed.";
                    // если раньше "Учебка" ещё не проходилась
                    if (globalThis.achievments[0] != 1) {
                        bodySummary = lang == "ru" ? "Пройдите уровень 'Учебка', чтобы " +
                            "ознакомиться с правилами и управлением." :
                            "Complete the 'Demo' level to familiarize yourself with " +
                            "the rules and control.";

                        leftBtnTxt = lang == "ru" ? "Повторить." : "Retry.";

                        leftBtn = `<button class="lvlBottom" onclick="MyGame.startLevel('demo')">
                            ${leftBtnTxt}</button>`;

                        rightBtnTxt = lang == "ru" ? "Отмена." : "Cancel.";

                        rightBtn = `<button class="lvlBottom" onclick=` +
                            `"globalThis.myUIBlocks.showBaseWnd(globalThis.achievments,globalThis.lang)">
                            ${rightBtnTxt}</button>`;
                    }
                    // если "Учебка" ранее уже проходилась
                    else {
                        // если уровень "Одиночка" уже пройден
                        if (globalThis.achievments[1] == 1) {
                            bodySummary = lang == "ru" ? " Если Вы захотите заменить бота, " +
                                "пройдите уровень 'Одиночка' ещё раз." :
                                "If you need to replace the Black Bot, complete the " +
                                " 'Loner' level one more time and you'll have another partner.";
                        }
                        // если уровень "Одиночка" ещё не пройден
                        else {
                            bodySummary = lang == "ru" ? "Пройдите уровень 'Одиночка' чтобы " +
                                "получить свою первую звезду, и у вас появится напарник-бот " +
                                "для игры 'В два ствола'. Удачи!" :
                                "Complete the 'Loner' level to get your first star, and you will " +
                                "have a partner-bot for playing 'Two gun' level. Good luck!";
                        }

                        leftBtnTxt = lang == "ru" ? "Продолжить." : "Continue.";

                        leftBtn = `<button class="lvlBottom" onclick="MyGame.startLevel('loner')">
                                ${leftBtnTxt}</button>`;

                        rightBtnTxt = lang == "ru" ? "Отмена." : "Cancel.";

                        rightBtn = `<button class="lvlBottom" onclick=` +
                            `"globalThis.myUIBlocks.showBaseWnd(globalThis.achievments,globalThis.lang)">
                                ${rightBtnTxt}</button>`;
                    }
                }
                break;
            case lvlNames.Loner:
                // если уровень "Одиночка" пройден
                if (result == GameState.Win) {
                    summaryTopTxt = lang == "ru" ? "Уровень 'Одиночка' пройден!" :
                        "Congratulation! Level 'Loner' completed.";
                    // если уровень "Одиночка" пройден впервые
                    if (globalThis.achievments[1] != 1) {
                        globalThis.achievments[1] = 1;
                        lvlsDataStr = JSON.stringify(globalThis.achievments)

                        try {
                            globalThis.gPlayer.setData({ lvlsData: lvlsDataStr }).
                                then(() => { });
                        } catch (err) { }

                        try {
                            localStorage.setItem("lvlsData", lvlsDataStr)
                        } catch (err) { }
                        bodySummary = lang == "ru" ? "Вы получаете свою первую звезду и у Вас теперь есть напарник- Чёрный Бот, " +
                            "с которым Вы можете пройти уровень 'В два ствола'." +
                            " Бот будет пытаться повторять все ваши действия на только что пройденном уровне." +
                            " Если Вы захотите заменить бота, пройдите этот уровень ещё раз." :
                            "Excellent! You get your first star and you now have a bot partner," +
                            "with which you can complete the level 'Two barrels'." +
                            " The bot will try to repeat all your actions on the level you just passed." +
                            " If you want to replace the bot, go through this level again.";
                    }
                    // если уровень "Одиночка" раньше был уже пройден
                    else {
                        bodySummary = lang == "ru" ? "Вы ещё раз прошли этот уровень и теперь у Вас новый напарник-бот, который будет" +
                            " пытаться повторять все ваши действия на только что пройденном уровне." +
                            " Если Вы захотите заменить бота, пройдите этот уровень ещё раз." :
                            "You have completed this level once again and now you have a new bot partner who will " +
                            " try to repeat all your actions on the level you just passed." +
                            " If you want to replace the bot, go through this level again.";
                    }

                    leftBtnTxt = lang == "ru" ? "Продолжить." : "Continue.";

                    leftBtn = `<button class="lvlBottom" onclick="MyGame.startLevel('twoGuns')">
                                ${leftBtnTxt}</button>`;

                    rightBtnTxt = lang == "ru" ? "Отмена." : "Cancel.";

                    rightBtn = `<button class="lvlBottom" onclick=` +
                        `"globalThis.myUIBlocks.showBaseWnd(globalThis.achievments,globalThis.lang)">
                                ${rightBtnTxt}</button>`;
                }
                // если попытка пройти уровень "Одиночка" неудачна
                else {
                    try {
                        globalThis.gYsdk.adv.showFullscreenAdv()
                    } catch (err) {
                        console.log("Одиночка adv "+err);
                    }
                    finally {
                        summaryTopTxt = lang == "ru" ? "Уровень не пройден." :
                            "The level is not passed.";
                        // если уровень "Одиночка" ещё не проходился
                        if (globalThis.achievments[1] != 1) {
                            bodySummary = lang == "ru" ? "Пройдите этот уровень чтобы получить" +
                                " свою первую звезду, и у вас появится напарник-бот для игры 'В два ствола' ." +
                                " Бот будет пытаться повторять все ваши действия на пройденном уровне." :
                                "Complete this level to get your first star, " +
                                "and you will have a partner - a bot for the game 'Two gun'." +
                                " The bot will try to repeat all your actions at the completed level.";

                            leftBtnTxt = lang == "ru" ? "Повторить." : "Retry.";

                            leftBtn = `<button class="lvlBottom" onclick="MyGame.startLevel('loner')">
                                        ${leftBtnTxt}</button>`;

                            rightBtnTxt = lang == "ru" ? "Отмена." : "Cancel.";

                            rightBtn = `<button class="lvlBottom" onclick=` +
                                `"globalThis.myUIBlocks.showBaseWnd(globalThis.achievments,globalThis.lang)">
                                        ${rightBtnTxt}</button>`;
                        }
                        // если уровень "Одиночка" ранее уже был пройден
                        else {
                            bodySummary = lang == "ru" ? "Если Вам нужно заменить Чёрного Бота, пройдите уровень " +
                                "'Одиночка.' ещё раз и у Вас появится другой напарник." :
                                " If you want to replace the bot, go through this level again.";

                            leftBtnTxt = lang == "ru" ? "Повторить." : "Retry.";

                            leftBtn = `<button class="lvlBottom" onclick="MyGame.startLevel('loner')">
                                            ${leftBtnTxt}</button>`;

                            rightBtnTxt = lang == "ru" ? "Отмена." : "Cancel.";

                            rightBtn = `<button class="lvlBottom" onclick=` +
                                `"globalThis.myUIBlocks.showBaseWnd(globalThis.achievments,globalThis.lang)">
                                            ${rightBtnTxt}</button>`;
                        }
                    }
                }
                break;
            case lvlNames.TwoGuns:
                // уровень "В два ствола" пройден
                if (result == GameState.Win) {
                    summaryTopTxt = lang == "ru" ? "Уровень 'В два ствола' пройден!" :
                        "Congratulation! Level 'Two guns.' completed.";
                    // если уровень "В два ствола" пройден впервые
                    if (globalThis.achievments[2] != 1) {
                        globalThis.achievments[2] = 1;
                        lvlsDataStr = JSON.stringify(globalThis.achievments)

                        try {
                            globalThis.gPlayer.setData({ lvlsData: lvlsDataStr }).
                                then(() => { });
                        } catch (err) { }

                        try {
                            localStorage.setItem("lvlsData", lvlsDataStr)
                        } catch (err) { }

                        bodySummary = lang == "ru" ? "Вы получаете вторую звезду!" +
                            " Пройдите учебный уровень 'В лесу.', чтобы познакомиться с новой локацией." :
                            "Excellent! You get your second star. Complete the training level " +
                            "'In the forest.'to get to know the new location.";
                    }
                    // если уровень "В два ствола" уже проходился ранее
                    else {
                        summaryTopTxt = lang == "ru" ? "Уровень 'В два ствола' пройден!" :
                            " Level 'Two guns.' completed.";

                        bodySummary = lang == "ru" ? " Пройдите учебный уровень 'В лесу.'," +
                            " чтобы познакомиться с новой локацией." :
                            " Complete the training level " +
                            "'In the forest.'to get to know the new location.";
                    }

                    leftBtnTxt = lang == "ru" ? "Продолжить." : "Continue.";

                    leftBtn = `<button class="lvlBottom" onclick="MyGame.startLevel('demoF')">
                                                ${leftBtnTxt}</button>`;

                    rightBtnTxt = lang == "ru" ? "Отмена." : "Cancel.";

                    rightBtn = `<button class="lvlBottom" onclick=` +
                        `"globalThis.myUIBlocks.showBaseWnd(globalThis.achievments,globalThis.lang)">
                                                ${rightBtnTxt}</button>`;
                }
                // уровень "В два ствола" не пройден
                else {
                    try {
                        globalThis.gYsdk.adv.showFullscreenAdv()
                    } catch (err) {
                        console.log("Одиночка adv " + err);
                    }
                    finally {
                        // если уровень "В два ствола" и ранее не проходился
                        if (globalThis.achievments[2] != 1) {
                            summaryTopTxt = lang == "ru" ? "Уровень 'В два ствола' не пройден!" :
                                "The level  'Two guns.' is not passed.";

                            bodySummary = lang == "ru" ? " Пройдите этот уровень, чтобы " +
                                "перейти на новую локацию 'В лесу.'" :
                                " Complete this level to get to know the new location 'In the forest.'";
                        }
                        else {
                            summaryTopTxt = lang == "ru" ? "Уровень 'В два ствола' не пройден!" :
                                "The level  'Two guns.' is not passed.";

                            bodySummary = lang == "ru" ? "Уровень 'В два ствола'" +
                                " вами уже проходился ранее!" :
                                "Level 'In two barrels ' you have already passed before.";
                        }

                        leftBtnTxt = lang == "ru" ? "Повторить." : "Retry.";

                        leftBtn = `<button class="lvlBottom" onclick="MyGame.startLevel('twoGuns')">
                                            ${leftBtnTxt}</button>`;

                        rightBtnTxt = lang == "ru" ? "Отмена." : "Cancel.";

                        rightBtn = `<button class="lvlBottom" onclick=` +
                            `"globalThis.myUIBlocks.showBaseWnd(globalThis.achievments,globalThis.lang)">
                                            ${rightBtnTxt}</button>`;
                    }
                }
                break;
            case lvlNames.DemoF:
                // уровень "В лесу" пройден
                if (result == GameState.Win) {
                    summaryTopTxt = lang == "ru" ? "Уровень 'В лесу' пройден!" :
                        "Congratulation! Level 'In the forest.' completed.";
                    // если уровень "В лесу" пройден впервые
                    if (globalThis.achievments[3] != 1) {
                        globalThis.achievments[3] = 1;
                        lvlsDataStr = JSON.stringify(globalThis.achievments)

                        try {
                            globalThis.gPlayer.setData({ lvlsData: lvlsDataStr }).
                                then(() => { });
                        } catch (err) { }

                        try {
                            localStorage.setItem("lvlsData", lvlsDataStr)
                        } catch (err) { }

                        bodySummary = lang == "ru" ? "Пройдите уровень 'Оборона'!" +
                            " Вам придётся уничтожить 1000 врагов при лимите патронов."+
                            "Вам даётся 200 патронов и добавляется 15 за каждые 10"+
                            " уничтоженных врагов." :
                            "Excellent! Complete the next level 'Defence'. " +
                            "You will have to destroy 1000 enemies with a limit of ammo."+
                            "You are given 200 bullets for this"+
                            " and 15 are added for every 10  enemies killed.";
                    }
                    // если уровень "В лесу" уже проходился ранее
                    else {
                        summaryTopTxt = lang == "ru" ? "Уровень 'В лесу' пройден!" :
                            " Level 'In the forest.' completed.";

                        bodySummary = lang == "ru" ? "Пройдите уровень 'Оборона'!" +
                            " Вам придётся уничтожить 1000 врагов при лимите патронов."+
                            "Вам даётся 200 патронов и добавляется 15 за каждые 10"+
                            " уничтоженных врагов." :
                            "Excellent! Complete the next level 'Defence'. " +
                            "You will have to destroy 1000 enemies with a limit of ammo."+
                            "You are given 200 bullets for this"+
                            " and 15 are added for every 10  enemies killed.";
                    }

                    leftBtnTxt = lang == "ru" ? "Продолжить." : "Continue.";

                    leftBtn = `<button class="lvlBottom" onclick="MyGame.startLevel('forest')">
                                                    ${leftBtnTxt}</button>`;

                    rightBtnTxt = lang == "ru" ? "Отмена." : "Cancel.";

                    rightBtn = `<button class="lvlBottom" onclick=` +
                        `"globalThis.myUIBlocks.showBaseWnd(globalThis.achievments,globalThis.lang)">
                                                    ${rightBtnTxt}</button>`;
                }
                // уровень "В лесу" не пройден
                else {
                    try {
                        globalThis.gYsdk.adv.showFullscreenAdv()
                    } catch (err) {
                        console.log("В лесу adv " + err);
                    }
                    finally {
                        // если уровень "В лесу" и ранее не проходился
                        if (globalThis.achievments[3] != 1) {
                            summaryTopTxt = lang == "ru" ? "Уровень 'В лесу' не пройден!" :
                                "The level  'In the forest.' is not passed.";

                            bodySummary = lang == "ru" ? " Пройдите этот уровень, чтобы " +
                                "перейти на новую локацию 'Оборона.'" :
                                " Complete this level to get to know the new location 'Defence.'";
                        }
                        else {
                            summaryTopTxt = lang == "ru" ? "Уровень 'В лесу' не пройден!" :
                                "The level  'In the forest.' is not passed.";

                            bodySummary = lang == "ru" ? "Уровень 'В лесу'" +
                                " вами уже проходился ранее!" :
                                "Level 'In the forest ' you have already passed before.";
                        }

                        leftBtnTxt = lang == "ru" ? "Повторить." : "Retry.";

                        leftBtn = `<button class="lvlBottom" onclick="MyGame.startLevel('demoF')">
                                                ${leftBtnTxt}</button>`;

                        rightBtnTxt = lang == "ru" ? "Отмена." : "Cancel.";

                        rightBtn = `<button class="lvlBottom" onclick=` +
                            `"globalThis.myUIBlocks.showBaseWnd(globalThis.achievments,globalThis.lang)">
                                                ${rightBtnTxt}</button>`;
                    }
                }
                break;
            case lvlNames.Forest:
                // уровень "Оборона" пройден
                if (result == GameState.Win) {
                    summaryTopTxt = lang == "ru" ? "Уровень 'Оборона' пройден!" :
                        "Congratulation! Level 'Defence.' completed.";
                    // если уровень "Оборона" пройден впервые
                    if (globalThis.achievments[4] != 1) {
                        globalThis.achievments[4] = 1;
                        lvlsDataStr = JSON.stringify(globalThis.achievments)

                        try {
                            globalThis.gPlayer.setData({ lvlsData: lvlsDataStr }).
                                then(() => { });
                        } catch (err) { }

                        try {
                            localStorage.setItem("lvlsData", lvlsDataStr)
                        } catch (err) { }

                        bodySummary = lang == "ru" ? "Вы получаете третью звезду!" +
                        " Вы можете улучшить свой результат на этом уровне." :
                        "You get a third star!" +
                        "You can improve your score at this level.";
                    }
                    // если уровень "Оборона" уже проходился ранее
                    else {
                        summaryTopTxt = lang == "ru" ? "Уровень 'Оборона' пройден!" :
                            " Level 'Defence.' completed.";

                        bodySummary = lang == "ru" ? "Уровень 'Оборона'" +
                        " вами уже проходился ранее, но можно улучшить" +
                        " свой результат!" :
                        "Level 'Defence' you have already passed before, "+
                        " but you can improve your result.";
                    }

                    leftBtnTxt = lang == "ru" ? "Продолжить." : "Continue.";

                    leftBtn = `<button class="lvlBottom" onclick="MyGame.startLevel('forest')">
                                                    ${leftBtnTxt}</button>`;

                    rightBtnTxt = lang == "ru" ? "Отмена." : "Cancel.";

                    rightBtn = `<button class="lvlBottom" onclick=` +
                        `"globalThis.myUIBlocks.showBaseWnd(globalThis.achievments,globalThis.lang)">
                                                    ${rightBtnTxt}</button>`;
                }
                // уровень "Оборона" не пройден
                else {
                    try {
                        globalThis.gYsdk.adv.showFullscreenAdv()
                    } catch (err) {
                        console.log("Оборона adv " + err);
                    }
                    finally {
                        // если уровень "Оборона" и ранее не проходился
                        if (globalThis.achievments[4] != 1) {
                            summaryTopTxt = lang == "ru" ? "Уровень 'Оборона' не пройден!" :
                                "The level  'Defence.' is not passed.";

                            bodySummary = lang == "ru" ? " Пройдите этот уровень, чтобы " +
                                "получить свою третью звезду.'" :
                                " Complete this level to get your third star.";
                        }
                        else {
                            summaryTopTxt = lang == "ru" ? "Уровень 'Оборона' не пройден!" :
                                "The level  'Defence.' is not passed.";

                            bodySummary = lang == "ru" ? "Уровень 'Оборона'" +
                                " вами уже проходился ранее, но можно улучшить" +
                                " свой результат!" :
                                "Level 'Defence' you have already passed before, " +
                                " but you can improve your result.";
                        }
                    

                    leftBtnTxt = lang == "ru" ? "Повторить." : "Retry.";

                    leftBtn = `<button class="lvlBottom" onclick="MyGame.startLevel('forest')">
                                                ${leftBtnTxt}</button>`;

                    rightBtnTxt = lang == "ru" ? "Отмена." : "Cancel.";

                    rightBtn = `<button class="lvlBottom" onclick=` +
                        `"globalThis.myUIBlocks.showBaseWnd(globalThis.achievments,globalThis.lang)">
                                                ${rightBtnTxt}</button>`;
                    }
                    break;
                }
        }

        let locNumStars = 0;

        for (let i = 0; i < globalThis.achievments.length; i++) {
            if ((globalThis.achievments[i] == 1) && (i != 0) && (i != 3)) {
                locNumStars++;
            }
        }
        // let summaryTopTxt = (result == GameState.Win)? this.myPhrases.capSummaryWin :
        //     this.myPhrases.capSummaryLost;
        let replanish = (numEnemies == 0) ? 0 : Math.round(numBullets * 100 / numEnemies) / 100;
        content =
            `<div id="modalWnd">
                <div id="summaryTop">
                    <p>${summaryTopTxt}</p>
                </div>
                <div id="summaryResult" >
                    <div style="margin: 5px;"><img src="pogon${locNumStars}.png" class="pogonImg"></div>
                    <div>
                        <ul>
                        <li>${this.myPhrases.destEnemy}&nbsp;
                            <span id="numEnimies">${numEnemies}</span></li>
                        <li>${this.myPhrases.spentAmmo}&nbsp;
                            <span id="numBullets">${numBullets}</span></li>
                        <li>${this.myPhrases.effectiv}&nbsp;
                            <span id="bulletsForEnemies">${replanish}</span>
                            ${this.myPhrases.effectivTail}</li>
                        </ul>
                    </div>
                </div>
                <div id="summaryMsg" >
                    <p>${bodySummary}</p>
                </div>
                <div style="display: flex; flex-direction: row; justify-content: space-around;">
                <div style="align-self: center;">${leftBtn}</div>
                <div style="align-self: center;">${rightBtn}</div>
                </div>
                </div>
            </div>`


        document.getElementById('modalContainer').innerHTML = content
        // document.getElementById("modalContainer").innerHTML = content;
        document.getElementById("modalContainer").style.visibility = "visible";
        document.getElementById("modalContainer").style.display = "flex"
    }
}
