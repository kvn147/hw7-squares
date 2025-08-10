import React, { Component, ChangeEvent, MouseEvent } from "react";


type FileListProps = {
  // TODO: may want to add some props
};


type FileListState = {
  name: string;  // text in the name text box
};


/** Displays the list of created design files. */
export class FileList extends Component<FileListProps, FileListState> {

  constructor(props: FileListProps) {
    super(props);

    this.state = {name: ''};
  }

  render = (): JSX.Element => {
    // TODO: format list of files as links

    return (<div>
        <h3>Files</h3>
        {/* TODO: Render file links & textbox for creating a file here */}
      </div>);
  };

  // Updates our record with the name text being typed in
  doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    // TODO: remove this code, implement
    console.log(evt);
  };

  // Updates the UI to show the file editor
  doCreateClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    // TODO: implement
  };

}
