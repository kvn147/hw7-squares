import React, { Component, ChangeEvent, MouseEvent } from "react";
import { Square, Path, split, solid  } from './square';
import { SquareElem } from "./square_draw";


type FileEditorProps = {
  // TODO: may want to add some props
};


type FileEditorState = {
  /** The root square of all squares in the design */
  root: Square;

  /** Path to the square that is currently clicked on, if any */
  selected?: Path;
};


/** UI for editing square design page. */
export class FileEditor extends Component<FileEditorProps, FileEditorState> {

  constructor(props: FileEditorProps) {
    super(props);

    this.state = { // TODO: probably want to change this
      root: split(solid("blue"), solid("orange"), solid("purple"), solid("pink"))
    };
  }

  render = (): JSX.Element => {
    // TODO: add some editing tools here
    return <SquareElem width={600n} height={600n}
                      square={this.state.root} selected={this.state.selected}
                      onClick={this.doSquareClick}></SquareElem>;
  };

  doSquareClick = (path: Path): void => {
    // TODO: remove this code, do something with the path to the selected square
    console.log(path);
    alert("Stop that!");
  }

  doSplitClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    // TODO: implement
  };

  doMergeClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    // TODO: implement
  };

  doColorChange = (evt: ChangeEvent<HTMLSelectElement>): void => {
    // TODO: remove this code, implement
    console.log(evt);
  };
}
