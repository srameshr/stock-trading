import {
    TRADE_MODAL_HIDE,
    TRADE_MODAL_SHOW
} from '../types';

export const tradeModalShow = () => {
    return {
        type: TRADE_MODAL_SHOW,
        payload: true,
    }
}

export const tradeModalHide = () => {
    return {
        type: TRADE_MODAL_HIDE,
        payload: false,
    }
}