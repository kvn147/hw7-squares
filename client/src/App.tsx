import React, { Component } from "react";
import { solid, split, Path, Square } from './square';
import { SquareElem } from './square_draw';


/** Describes set of possible app page views */
type Page = undefined; // TODO: Replace with a Page type that keeps track
                       //       of the necessary data

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
    this.state = {show: undefined};
  }

  render = (): JSX.Element => {
    // TODO: Render a loading screen if app is accessing data from the server
    //       or display file list page or editor page appropraitely
    const sq: Square = split(solid("blue"), solid("orange"), solid("purple"), solid("pink"));
    return <SquareElem width={600n} height={600n} square={sq}
      onClick={this.doSquareClick}/>;
  };

  // TODO: remove from app once you've implemented doSquareClick in FileEditor.tsx
  doSquareClick = (path: Path): void => {
    console.log(path);
    alert("Stop that!");
  };

  // TODO: write functions here to handle switching between app pages and
  //       for accessing the server
}
