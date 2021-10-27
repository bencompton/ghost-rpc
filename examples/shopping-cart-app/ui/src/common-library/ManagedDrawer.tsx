import * as React from 'react';
import { Drawer } from 'antd/lib/';
import { DrawerProps } from 'antd/lib/drawer';

export default class extends React.Component<DrawerProps, any> {
  constructor(props: DrawerProps, context: any) {
    super(props, context);

    this.state = {
      visible: true
    };
  }

  public render() {
    return (
      <Drawer {...{ ...this.props, visible: this.state.visible, onClose: this.onClose.bind(this) }}>
        {this.props.children}
      </Drawer>
    );
  }

  private onClose(e: any) {
    this.setState({
      visible: false
    });

    const setTimeout = (globalThis as any).setTimeout;
    setTimeout(() => this.props.onClose && this.props.onClose(e), 500);
  }
}
