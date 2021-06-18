import { Actions } from 'redux-retro';
import { push as pushUrl, replace as replaceUrl, goBack } from 'redux-first-routing';

import { IAppState } from '../store';

export default class MainNavigationActions extends Actions<IAppState> {
  public navigateTo(url: string, replace: boolean = false) {
    if (replace) {
      this.dispatch(replaceUrl(url));
    } else {
      this.dispatch(pushUrl(url));
    }
  }

  public goBack() {
    this.dispatch(goBack());
  }
}
