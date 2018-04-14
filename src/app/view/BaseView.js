import React, {Component} from 'react';
import colorManager from '../util/looknfeel/ColorManager';

class BaseView extends Component {

  constructor(props, context) {
    super(props, context);
    this.isUnmount = false;
    this.props = props;
  }

  componentDidMount(){
    sendEvent('changeAppBar', null);
    this.initPlaceColor();
  }

  initPlaceColor(){
    colorManager.initPlaceColor(null);
  }

  componentWillUnmount() {
    this.isUnmount = true;
  }

  setState(state){
    if(!this.isUnmount){
      super.setState(state);
    }
  }
}

export default BaseView;
