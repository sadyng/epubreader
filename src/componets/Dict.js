import React from 'react';

import { mobileAndTabletCheck } from "../utils/help";

export default class Dict extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            word: this.props.wordFromBook,
            defs: [],
            dict: {},
            style: {
            },
            clipboard: ''
        };
    }
    componentWillReceiveProps(nextProps) {
        //if your props is received after the component is mounted, then this function will update the state accordingly.
        if (this.props.wordFromBook !== nextProps.wordFromBook) {
            this.setState({
                word: nextProps.wordFromBook.toLowerCase().trim()
            });
        }
        if(this.props.dictfiles!==nextProps.dictfiles){
            console.log(nextProps.dictfiles)
            let fr = new FileReader();
        fr.onload = (e) => {
            let result = e.target.result;
            
            this.setState({
                dict: JSON.parse(result),
            })

        }
       nextProps.dictfiles.length > 0 && fr.readAsText(nextProps.dictfiles[0]);

        }
    }
    render() {
        return (
            <div className='dict' style={{ ...this.props.style, ...this.state.style }}>
                <div className='dict-button-group'>
                    <a href="#localdict"> <button className="dictbutton blue-font">Local</button> </a>
                    <a href="#yddict"> <button className="dictbutton blue-font">YouDao</button> </a>
                    <button onClick={() => this.moveUp()} className="dictbutton">Up</button>
                    <button onClick={() => this.moveDown()} className="dictbutton">Down</button>
                    <button onClick={() => this.toogleMaxium()} className="dictbutton">Max</button>
                    <button onClick={() => this.props.toggleDict()} className="dictbutton">Close</button>
                </div>
                <div id="dict-input-div">
                    <input
                    placeholder='Search'
                    type='text'
                    value={this.state.word}
                    onChange={(event) => this.handleInput(event)}
                />
                {
                    (this.state.style.height === '100%') &&
                    <textarea
                        readOnly
                        class='dict-textarea'
                        id="clipboardarea"
                        value={this.state.clipboard}
                        onClick={() => this.handleClipboard()}
                        onContextMenu={
                            function (event) {
                                event.preventDefault();
                                return false;
                            }
                        }
                        placeholder='click me to get text from clipboard,may only works on Chrome browser'
                    />
                }
                </div>
                

                {this.props.dictfiles.length !== 0 &&
                    <div id="localdict">
                        <p>dict file name: {this.props.dictfiles[0].name}</p>

                        <form onSubmit={(event) => {
                            event.preventDefault();
                            this.search(this.state.word);
                        }}>

                        </form>
                        <p>{this.props.wordFromBook}</p>
                        <div className='defview'>

                            {this.state.word.length > 1 &&
                                this.state.dict[this.state.word.toLowerCase()] &&
                                <div dangerouslySetInnerHTML={{ __html: this.state.dict[this.state.word.toLowerCase()] }} />}
                        </div>
                    </div>

                }

                <p>
                    有道在线词典
                </p>
                {mobileAndTabletCheck() === true &&
                    this.state.word.length >= 1 &&
                    <iframe title="youdao"
                        id="yddict"
                        width="100%"
                        height="500px"
                        src={`https://m.youdao.com/dict?q=${this.state.word}`}
                    />}
                {mobileAndTabletCheck() === false &&
                    this.state.word.length >= 1 &&
                    <iframe title="youdao"
                        id="yddict"
                        width="100%"
                        height="500px"
                        sandbox=""
                        src={`https://dict.youdao.com/w/${this.state.word}`}
                    />}
            </div>

        )
    }

    componentDidMount() {
        
        document.onselectionchange = () => {
            let word = document.getSelection().toString().trim();
            if (word.length > 1 && document.getSelection().anchorNode.id==='dict-input-div') {
                this.search(word);
            }
        };

    }

    moveUp() {
        this.setState({
            style: {
                top: 0
            }
        })
    }
    moveDown() {
        this.setState({
            style: {
                bottom: 0
            }
        })
    }

    maxmium() {
        this.setState({
            style: {
                height: '100%'
            }
        })
    }

    mainmium() {
        this.setState({
            style: {
                height: '50%'
            }
        })
    }
    toogleMaxium() {
        this.state.style.height !== '100%' ?
            this.maxmium()
            :
            this.mainmium();
    }

    handleInput(event) {
        this.setState({
            word: event.target.value.toLowerCase()
        })
    }
    search(word) {
        let dictObject = this.state.dict;
        let defs = dictObject[word];
        if (!defs) {
            defs = [`sorry no definition for the word '${word}'`]
        }
        this.setState({
            word: word,
            defs: defs,
        })
    }

    handleClipboard() {
        setInterval(() => {
            if (document.hasFocus()) {
                navigator.clipboard.readText().then(text => {
                    if (text === this.state.clipboard) {
                        return
                    }
                    this.setState({
                        clipboard: text,
                    })
                });

            }

        }, 1000);
    }
}