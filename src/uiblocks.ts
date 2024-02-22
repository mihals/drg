//import { startGame } from "./game";
import { GameState } from "./enums";
import { numMsg } from "./enums";

type phrases = {
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
    bodyContent : Array<string> 
}

const ruPhrases : phrases = {
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

    bodyContent : ["Если Вам непонятны правила или управление, жмите кнопку 'Учебка.', " +
    "если всё понятно - кнопку 'Одиночка' - это тот же уровень, но без презентации. "+
    "Пройдите его чтобы получить свою первую звезду, и у вас появится напарник-бот " +
    "для игры 'В два ствола'. Удачи!",
    "Пройдите уровень 'Одиночка' чтобы получить свою первую звезду, и у вас появится напарник-бот " +
    "для игры 'В два ствола'. Удачи!",
    " Превосходно! Вы получаете свою первую звезду и у Вас теперь есть напарник-бот, " + 
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
    " этот уровень ещё раз. Удачи!"]
} 

const enPhrases : phrases = {
    capSummaryWin : "The enemy has been completely terminated!",
    capSummaryLost : "The enemy has passed...",
    bodySummary: "If you do not understand the rules or control, click the 'Tutorial.' "+
    "button, if everything is clear, click 'Loner' button, it is the same level, but without "+
    "presentation. Go through it to get your first star, and you will have a bot "+
    "partner for a two-gun level. Good luck!",
    destEnemy : "Destroyed enemies: ",
    spentAmmo : "Spent ammo: ",
    effectiv : "Effectiveness: ",
    effectivTail: " ammo per enemy.",
    
    demoBtn : "With Demo",
    lonerBtn : " Loner ",
    twoGunsBtn : " Two gun ",

    bodyContent : ["If you do not understand the rules or control, click the 'Tutorial.' "+
    "button, if everything is clear, click 'Loner' button, it is the same level, but without "+
    "presentation. Go through it to get your first star, and you will have a bot "+
    "partner for a two-gun level. Good luck!",
    "Complete the 'Loner' level to get your first star, and you will have a partner-bot " +
    " for playing 'Two gun' level. Good luck!",
    "Excellent! You get your first star and you now have a bot partner," +
    "with which you can complete the level 'Two barrels'." +
    " The bot will try to repeat all your actions on the level you just passed." +
    " If you want to replace the bot, go through this level again.",
    "You have completed this level once again and now you have a new bot partner who will "+
    " try to repeat all your actions on the level you just passed." +
    " If you want to replace the bot, go through this level again.",
    " It has not worked out yet, but success awaits you ahead! Complete this level to get"+
    "your first star, and you will have a partner-a bot for the game 'Two gun'. Good luck!"+
    " The bot will try to repeat all your actions at the completed level.",
    "A little unlucky. But if you want to replace your bot, you will have to go through the "+
    " this level again. Good luck!"]
} 

export class UIBlocks {
    lang: string;
    myPhrases: phrases;

    constructor(lang: string) {
        if (lang == "ru") {
            this.myPhrases = ruPhrases;
        } else {
            this.myPhrases = enPhrases
        }
    }

    /** вставляет в контейнер набор кнопок с уровнями */
    showLevelsMenu(lang: string, lvlsAchives) {
        let content: string
        if (lang !== "ru") {
            content =
                `<div id="levelWnd">
                <div id = "topLevelWnd">
                    <img src="assets/pogon.png" class="pogonImg">
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
                    <img src="assets/pogon.png" class="pogonImg">
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
        document.getElementById("modalContainer").remove()
        // document.getElementById("modalContainer").innerHTML = "";
        // document.getElementById("modalContainer").style.visibility = "hidden";
        // document.getElementById("modalContainer").style.display = "none"
    }

    /** выводит итоговое окно с результатами пройденного уровня
     * @numBullets число потраченных патронов
     * @numEnemies число уничтоженных врагов
     * @result результат игры
     * @numMsg номер сообщения в окне
     */
    showSummary(numBullets: number, numEnemies: number,
        result: GameState, numMsg: number) {
        let content;
        let bodySummary;
        if(numMsg == 0){
            bodySummary = this.myPhrases.bodySummary;
        } 
        let summaryTopTxt = (result == GameState.Win)? this.myPhrases.capSummaryWin :
            this.myPhrases.capSummaryLost;
        let replanish = (numEnemies == 0) ? 0 : Math.round(numBullets * 100 / numEnemies) / 100;
        content =
            `<div id="modalContainer">
            <div id="modalWnd">
                <div id="summaryTop">
                    <p>${summaryTopTxt}</p>
                </div>
                <div id="summaryResult" >
                    <div style="margin: 5px;"><img src="assets/pogon.png" class="pogonImg"></div>
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
                <div style="align-self: center;">
                    <button class="lvlBottom" onclick="MyGame.hideModal(0)">
                    ${this.myPhrases.demoBtn}</button></div>
                <div style="align-self: center;">
                    <button class="lvlBottom" onclick="MyGame.hideModal(1)">
                    ${this.myPhrases.lonerBtn}</button></div>
                </div>
            </div></div>`

        let div = document.createElement('div');
        div.className = "modalContainer";
        div.innerHTML = content;
        document.body.append(div)
        // document.getElementById("modalContainer").innerHTML = content;
        // document.getElementById("modalContainer").style.visibility = "visible";
        // document.getElementById("modalContainer").style.display = "flex"
    }
}
