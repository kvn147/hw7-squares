import React, { Component, ChangeEvent, MouseEvent } from "react";


type FileListProps = {
  // TODO: may want to add some props
  files: string[];
  onFileClick: (name: string) => void;
  onCreateClick: (name: string) => void;
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
        {this.renderFileList()} <br/>
        Name:
        <input type="text" value={this.state.name} onChange={this.doNameChange} />
        <button onClick={this.doCreateClick}>Create</button>
      </div>);
  };

   renderFileList = (): JSX.Element => {
    if (this.props.files.length === 0) {
      return <p>No files found. Create a new file to get started!</p>;
    }

    const fileLinks: JSX.Element[] = [];
    for (const fileName of this.props.files) {
      fileLinks.push(
        <li key={fileName}>
          <a href="#" onClick={(evt) => this.doFileClick(evt, fileName)}>
            {fileName}
          </a>
        </li>
      );
    }

    return <ul>{fileLinks}</ul>;
  };

    doFileClick = (evt: MouseEvent<HTMLAnchorElement>, fileName: string): void => {
    evt.preventDefault();
    this.props.onFileClick(fileName);
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
    this.props.onCreateClick(this.state.name);
    this.setState({name: ''});
  };
}
