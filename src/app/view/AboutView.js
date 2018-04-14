import BaseView from './BaseView';
import React, {Component} from 'react';
import {about} from './styles';

class AboutView extends BaseView {

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
  }

  componentDidMount(){

  }

  componentWillUnmount() {
    
  }

  render() {
    return (
      <div style={about}>
        <p>
          A Zapt Tech é a primeira empresa a desenvolver uma plataforma híbrida e horizontal de IPS - Indoor Positioning System - associada aos recursos de Web Física, como transações por mera proximidade.
        </p>
        <p>
          A plataforma Zapt pemite que seus usuários, através de um único app,
          sejam guiados e transitem por estabelecimentos comerciais e não comerciais,
          além de locais de interesse público e privado,
          utilizando informações e serviços por mera proximidade.
         </p>
         <p>
            Versão: 1.0-config-20170411-1030
         </p>
      </div>
    );
  }
}

export default AboutView;
