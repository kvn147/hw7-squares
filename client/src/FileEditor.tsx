import React, { Component, ChangeEvent, MouseEvent } from "react";
import { Square, Path, split, solid, replaceSquare, toColor, findSquare  } from './square';
import { SquareElem } from "./square_draw";
import { prefix, len } from "./list";


type FileEditorProps = {
  // TODO: may want to add some props
  fileName: string;
  doBackClick: () => void;
  onSave: (name: string, square: Square) => void;
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
    return (
    <div>
      <SquareElem width={600n} height={600n}
                      square={this.state.root} selected={this.state.selected}
                      onClick={this.doSquareClick}/>
      <div>
        <button onClick={this.doSplitClick}>Split</button>
        <button onClick={this.doMergeClick}>Merge</button>
        <select onChange={this.doColorChange}>
          <option value="white">White</option>      
          <option value="black">Black</option>
          <option value="red">Red</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
          <option value="yellow">Yellow</option>
          <option value="orange">Orange</option>
          <option value="purple">Purple</option>    
        </select>
      </div>
    </div>
    );
  };

  doSquareClick = (path: Path): void => {
    this.setState({selected: path});
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
    const pathLength = len(this.state.selected);
    if (pathLength == 0n) {
      alert("Cannot merge root!");
      return;
    }
    const target = findSquare(this.state.selected, this.state.root);
    if (target.kind !== "solid") {
      alert("Selected square is not a solid square!");
      return;
    }
    const parentPath = prefix(pathLength - 1n, this.state.selected);
    const newRoot = replaceSquare(parentPath, solid(target.color), this.state.root);   
    this.setState({ root: newRoot, selected: parentPath }); 

  };

  doColorChange = (evt: ChangeEvent<HTMLSelectElement>): void => {
    if (this.state.selected === undefined) {
      alert("You must select a square to change its color!");
      return;
    }

    const newColor = toColor(evt.target.value);
    const newSquare = solid(newColor);
    const newRoot = replaceSquare(this.state.selected, newSquare, this.state.root);
    if (newRoot === undefined) {
      alert("Selected square not found in the root square!");
      return;
    }
    this.setState({ root: newRoot, selected: this.state.selected });
  };
}
