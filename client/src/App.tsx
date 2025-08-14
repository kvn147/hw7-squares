import React, { Component } from "react";
import { solid, split, Path, Square } from './square';
import { FileList } from './FileList';
import { FileEditor } from './FileEditor';

/** Describes set of possible app page views */
type Page = { readonly kind: "loading" } |
            { readonly kind: "fileList" } |
            { readonly kind: "fileEditor", readonly name: string };

type AppState = {
  show: Page;   // Stores state for the current page of the app to show
};

/**
 * Displays the square application containing either a list of files names
 * to pick from or an editor for files files
 */
export class App extends Component<{}, AppState> {

  constructor(props: {}) {
    super(props);

    // TODO: change to correct starting view once it's implemented
    this.state = {show: {kind: "fileList"}};
  }

  render = (): JSX.Element => {
    // TODO: Render a loading screen if app is accessing data from the server
    //       or display file list page or editor page appropraitely
    if (this.state.show.kind === "fileList") {
      return <FileList doFileClick={this.doFileClick} doCreateClick={this.doCreateClick} />;
    }
    if (this.state.show.kind === "fileEditor") {
      return <FileEditor fileName={this.state.show.name} doBackClick={this.doBackClick} doSquareClick={this.doSquareClick} />;
    } 
    return (<FileEditor fileName={show.name} doBackClick={this.doBackClick} onSave={this.doSave} />);
  };

  // TODO: remove from app once you've implemented doSquareClick in FileEditor.tsx
  doSquareClick = (path: Path): void => {
    console.log(path);
    alert("Stop that!");
  };

  // TODO: write functions here to handle switching between app pages and
  //       for accessing the server
  doCreateClick = (name: string): void => {
    this.setState({show: {kind: "fileEditor", name}});
  };
  doFileClick = (name: string): void => {
    this.setState({show: {kind: "fileEditor", name}});
  };
  doBackClick = (): void => {
    this.setState({show: {kind: "fileList"}});
  }
}
