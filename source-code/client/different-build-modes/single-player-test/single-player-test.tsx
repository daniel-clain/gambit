
import * as React from 'react';
import { frontEndService } from '../../front-end-service/front-end-service';
import '../../styles/global.scss';
import Game_View from '../../views/game/game.view'
import { MainGameProps, withBase } from '../base';

withBase(({inGame}: MainGameProps) => {
    return inGame ? <Game_View /> : <>loading....</>
  }, frontEndService('Local').frontEndStore
)

