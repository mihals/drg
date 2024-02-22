/** сообщения, которые выводятся по окончании игры */
export enum numMsg { 
    /** сообщение после самой первой игры */
    FirstGame, 
    /** выводится при удачном окончании Preview при непройденном Alone */
    PreviewWithautAlone,
    /** выводится при впервые пройденном Alone */
    FirstAloneWin,
    /** выводится при повторно пройденном Alone */
    AnotherAloneWin,
    /** после неудачно завершенного так и непройденного Alone */
    AloneLost,
    /** после неудачного завершения уже пройденного Alone */
    AnotherAloneLost
}

export enum lvlNames {Preview, Alone, TwoGuns}

export  enum GameState{Gone, Win, Lost}