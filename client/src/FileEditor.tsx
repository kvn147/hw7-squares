import React, { Component, ChangeEvent, MouseEvent } from "react";
import { Square, Path, split, solid, replaceSquare, toColor  } from './square';
import { SquareElem } from "./square_draw";


type FileEditorProps = {
  // TODO: may want to add some props
  fileName: string;
  dnBackClick: () => void;
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
    this.setState({
      selected: path
    });
  }

  doSplitClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    // TODO: implement
    if (this.state.selected === undefined) {
      alert("You must select a square to split!");
      return;
    }

    const newSquare = split(
      solid("white"), 
      solid("white"), 
      solid("white"), 
      solid("white")
    );

    const newRoot = replaceSquare(this.state.selected, newSquare, this.state.root);
    if (newRoot === undefined) {
      alert("Selected square not found in the root square!");
      return;
    }

    this.setState({ root: newRoot, selected: this.state.selected });
  };

  doMergeClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    // TODO: implement
    if (this.state.selected === undefined) {
      alert("You must select a square to merge!");
      return;
    }

  };

  doColorChange = (evt: ChangeEvent<HTMLSelectElement>): void => {
    if (this.state.selected === undefined) {
      alert("You must select a square to change its color!");
      return;
    }

    const newColor = toColor(evt.target.value);
    const newSquare = solid(newColor);
  };
}
