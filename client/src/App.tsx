import React, { Component } from "react";
import { Square, toJson, fromJson, solid, split } from './square';
import { FileList } from './FileList';
import { FileEditor } from './FileEditor';

/** Describes set of possible app page views */
type Page = { readonly kind: "loading" } |
            { readonly kind: "loadingFiles", readonly name: string } |
            { readonly kind: "fileList" } |
            { readonly kind: "fileEditor", readonly name: string, readonly square: Square };

type AppState = {
  show: Page;   // Stores state for the current page of the app to show
  files: string[];  // List of available files
};

const hasValue = (x: unknown): x is { value: unknown } =>
  typeof x === "object" && x !== null && "value" in x;

const hasFiles = (x: unknown): x is { files: unknown } =>
  typeof x === "object" && x !== null && "files" in x;

/**
 * Displays the square application containing either a list of files names
 * to pick from or an editor for files files
 */
export class App extends Component<{}, AppState> {

  constructor(props: {}) {
    super(props);

    // Initialize with empty file list and fileList view
    this.state = {
      show: {kind: "fileList"},
      files: []
    };
  }

  componentDidMount = (): void => {
    // Load file list when component mounts
    this.doFilesRequestClick();
  };

  render = (): JSX.Element => {
    // TODO: Render a loading screen if app is accessing data from the server
    //       or display file list page or editor page appropraitely
    switch (this.state.show.kind) {
    case "loading":
    case "loadingFiles":
      return <div>Loading...</div>;

    case "fileList":
      return (
        <FileList
          files={this.state.files}
          onFileClick={this.doFileClick}
          onCreateClick={this.doCreateClick}
        />
      );

    case "fileEditor":
      return (
        <FileEditor
          fileName={this.state.show.name}
          initialSquare={this.state.show.square}
          onBackClick={this.doBackClick}
          onSave={this.doSaveClick}
        />
      );
    }
  };
  
  // TODO: write functions here to handle switching between app pages and
  //       for accessing the server
  doCreateClick = (name: string): void => {
    const defaultSquare = split(solid("blue"), solid("orange"), solid("purple"), solid("pink"));
    this.setState({show: {kind: "fileEditor", name, square: defaultSquare}});
  };
  
  doFileClick = (name: string): void => {
    this.setState({show: {kind: "loadingFiles", name}});

    const url = `/api/load?name=${encodeURIComponent(name)}`;
    fetch(url)
      .then(this.doLoadResp)
      .then(this.doLoadJson)
      .then((payload) => this.doLoadSuccessClick(name, payload))
      .catch(this.doLoadError);
  };

  doBackClick = (): void => {
    this.setState({show: {kind: "fileList"}, files: this.state.files});
  }

  doSaveClick = (name: string, square: Square): void => {
    this.setState({ show: { kind: "loading" } });

    const body = { value: toJson(square) };
    const url = "/api/save?name=" + encodeURIComponent(name);

    fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" }
    })
      .then(this.doSaveResp)
      .then(() => this.doSaveSuccessClick(name, square))
      .catch(this.doSaveError);
  }

  doLoadResp = (res: Response): Promise<unknown> => {
    if (res.status === 200) {
      return res.json();
    } else {
      throw new Error(`bad status code from /api/load: ${res.status}`);
    }
  };

  doLoadJson = (data: unknown): {value: unknown} => {
    if (hasValue(data)) {
      return { value: data.value };
    }
    throw new Error("Invalid response format from /api/load");
  };

  doLoadSuccessClick = (name: string, payload: { value: unknown }): void => {
    if (payload.value === null) {
      alert(`File "${name}" not found`);
      this.setState({ show: { kind: "fileList" }, files: this.state.files });
      return;
    }
    const square = fromJson(payload.value);
    this.setState({
      show: { kind: "fileEditor", name, square },
      files: this.state.files
    });
  };

  doLoadError = (err: unknown): void => {
    // Log a descriptive error message
    if (err instanceof Error) {
      console.error("Error loading file:", err.message);
      alert("Error loading file: " + err.message);
    } else {
      console.error("Unknown error loading file");
      alert("Error loading file");
    }
    this.setState({show: {kind: "fileList"}, files: this.state.files});
  };

  doFilesRequestClick = (): void => {
    this.setState({ show: { kind: "loading" } });

    fetch("/api/files")
      .then(this.doFilesResp)
      .then(this.doFilesJson)
      .then(this.doFilesSuccessClick)
      .catch(this.doFilesError);
  };

   doFilesResp = (res: Response): Promise<unknown> => {
    if (res.status === 200) {
      return res.json();
    } else {
      throw new Error(`bad status code from /api/files: ${res.status}`);
    }
  };

  doFilesJson = (data: unknown): { files: string[] } => {
    if (hasFiles(data)) {
      const raw = data.files;
      if (Array.isArray(raw)) {
        // Build a validated string[] without casts
        const out: string[] = [];
        let i = 0;

        // Inv: 0 <= i && i <= raw.length
        //      and out contains exactly the first i elements of raw, each of which is a string.
        // Variant: raw.length - i (strictly decreases)
        while (i < raw.length) {
          const v = raw[i];
          if (typeof v !== "string") {
            throw new Error('Invalid "files" element from /api/files');
          }
          out.push(v);
          i += 1;
        }
        return { files: out };
      }
    }
    throw new Error("Invalid response format from /api/files");
  };
  
  doFilesSuccessClick = (payload: { files: string[] }): void => {
    this.setState({ show: { kind: "fileList" }, files: payload.files });
  };

  doFilesError = (err: unknown): void => {
    if (err instanceof Error) {
      console.error("Error loading file list:", err.message);
      alert("Error loading file list: " + err.message);
    } else {
      console.error("Unknown error loading file list");
      alert("Error loading file list");
    }
    this.setState({show: {kind: "fileList"}, files: []});
  };

  doSaveResp = (res: Response): void => {
    // We don't need the body; just ensure success.
    if (res.status !== 200) {
      throw new Error(`bad status code from /api/save: ${res.status}`);
    }
  };

  doSaveSuccessClick = (name: string, square: Square): void => {
  // Stay on editor; refresh files in the background
  this.setState({ show: { kind: "fileEditor", name, square } });
  this.doFilesRequestClick();
  };

  doSaveError = (err: unknown): void => {
    if (err instanceof Error) {
      console.error("Error saving file:", err.message);
      alert("Error saving file: " + err.message);
    } else {
      console.error("Unknown error saving file");
      alert("Error saving file");
    }
    // If save failed from loading state, go back to list to avoid a stuck loader
    this.setState({ show: { kind: "fileList" }, files: this.state.files });
  };

}
