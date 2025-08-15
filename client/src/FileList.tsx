import React, { Component, ChangeEvent, MouseEvent } from "react";


type FileListProps = {
  // TODO: may want to add some props
  doFileClick: (name: string) => void;
  doCreateClick: (name: string) => void;
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
    

    return (
      <div>
        <h3>Files</h3>
        {/* TODO: Render file links & textbox for creating a file here */}
        <ul>
          {/* List of files here */}
        </ul>
        Name:
        <input type="text" value={this.state.name} onChange={this.doNameChange} />
        <button onClick={this.doCreateClick}>Create</button>
      </div>);
  };

  // Updates our record with the name text being typed in
  doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    // TODO: remove this code, implement
    this.setState({name: evt.target.value});
  };

  // Updates the UI to show the file editor
  doCreateClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    // TODO: implement
    if (this.state.name.trim() === '') {
      alert("You must enter a name for the new file!");
      return;
    }
    this.props.doCreateClick(this.state.name);
    this.setState({name: ''});
  };

}
