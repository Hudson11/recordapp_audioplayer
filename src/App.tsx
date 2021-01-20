import React, { useState } from 'react';
import './App.css';
import ReactAudioPlayer from 'react-audio-player'
import AudioPlayer from 'material-ui-audio-player'
import { ThemeProvider, createMuiTheme } from '@material-ui/core'

function App() {

  const [url, setUrl] = useState('')

  function download(url: string, key: string): void {
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', key)
    document.body.appendChild(link)
    link.click()
  }

  function stream(): void {
    fetch('record.mp3')
      .then(response => {
        const reader = response.body?.getReader()
        return new ReadableStream({
          start(controller) {
            return pump();
            function pump(): any {
              if (reader !== undefined) {
                return reader.read().then(({ done, value }) => {
                  // When no more data needs to be consumed, close the stream
                  if (done) {
                    controller.close();
                    return;
                  }
                  // Enqueue the next data chunk into our target stream
                  controller.enqueue(value);
                  return pump();
                });
              }
              else {
              }
            }
          }
        })
      })
      .then(stream => new Response(stream))
      .then(response => response.blob())
      .then(blob => URL.createObjectURL(blob))
      .then(url => setUrl(url))
      .then(err => console.log(err))
  }

  const theme = createMuiTheme({

  })

  return (
    <div className="App">
      <div>
        <h2> AUDIO REACT COMPONENT </h2>
        <ReactAudioPlayer
          src="https://www.buscasons.com/_arq/trl_200804161008.mp3"
          controls
          preload='metadata'
          onLoadedMetadata={meta => console.log(meta)}
        />
      </div>
      <div>
        <h2> AUDIO HTML5 COMPONENT STREAM</h2>
        <button onClick={() => stream()}> stream </button> <br />
        <button onClick={() => download('record.mp3', 'record')}> download </button> <br />
        <audio
          src={url} 
          controls 
          onLoadedMetadata={e => console.log(e)}
        />
      </div>
      <div>
        <h2> MATERIAL-UI AUDIO COMPONENT </h2>
        <ThemeProvider theme={theme}>
          <AudioPlayer
            src='https://www.buscasons.com/_arq/trl_200804161008.mp3'
            download
            elevation={1}
            variation="primary"
          />
        </ThemeProvider>
      </div>
    </div>
  );
}

export default App;
