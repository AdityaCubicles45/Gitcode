import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import FileSaver from 'file-saver';
import { useCallback, useRef, useState } from 'react';
import { create } from 'ipfs-http-client';
import { providers, Contract, ethers } from 'ethers';
import { contractAddress, abi } from '../constants';
import huddleClient from '../utils/huddleClient';
import { useHuddleStore } from '@huddle01/huddle01-client/store';
import ShareVideoElem from './ShareVideoElem';

export default function EditorPage(props) {
  const editorRef = useRef(null);
  const [content, setContent] = useState('');
  const [name, setName] = useState('');
  const [file, setFile] = useState('');
  const [hash, setHash] = useState('');
  const [ipfsLink, setIpfsLink] = useState('');
  const [lang, setLang] = useState('javascript');

  const projectId = '2KwaoOl1zY6POCINIGnPji27rdB';
  const projectSecret = '783ec42e795c6f8b6dccdacc00a5b0bb';
  const authorization = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

  const client = create({ url: 'https://ipfs.infura.io:5001/api/v0', headers: { authorization } });
  function isPresent(array, fileName) {
    return array.includes(fileName);
  }

  const isSharing = useHuddleStore(useCallback((state) => state.gridView === 'share', []));

  async function upload() {
    try {
      props.setLoading(true);
      const blob = new Blob([content], { type: 'text/plain' });

      const added = await client.add(file);
      console.log(file);
      const signer = await props.getSigner(true);
      const contract = new Contract(contractAddress, abi, signer);
      setHash(added.path);
      console.log('add path:', added.path);
      const url = `https://ipfs.io/ipfs/${added.path}`;
      setIpfsLink(url);
      console.log('hash:', hash);
      console.log('url:', url);
      console.log('ipfsLink:', ipfsLink);

      //add contract upload integeration here
      const userFiles = await contract.getFilesOfAddress(props.address);
      if (isPresent(userFiles, name)) {
        //then check for last hash if last hash is same as current dont commit otherwise commit
        const versions = await contract.getVersionOfFile(props.address, name);
        console.log(versions);
        const latestVersion = versions[versions.length - 1];
        console.log(latestVersion);

        if (url == (await latestVersion.ipfsUrl)) {
          console.log('file is same');
          props.setLoading(false);
          return;
        }
        const tx = await contract.createFile(name, url);
        await tx.wait();
        props.setLoading(false);
        const fileName = name;
        FileSaver.saveAs(blob, fileName);
      } else {
        const tx = await contract.createFile(name, ipfsLink);
        await tx.wait();
        props.setLoading(false);
        const fileName = name;
        FileSaver.saveAs(blob, fileName);
      }
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }

  const saveFile = async () => {
    await upload();
  };
  function handleEditorChange(value, event) {
    setContent(value);
    console.log('value:', value);
    console.log('content:', content);
    const fileN = new File([value], name, { type: 'text/plain' });
    setFile(fileN);
  }
  function handleName(e) {
    setName(e.target.value);
  }
  function handleLang(e) {
    setLang(e.target.value);
  }

  console.log({ isSharing });

  if (isSharing) {
    return (
      <div>
        <ShareVideoElem />
      </div>
    );
  }

  return (
    <div className='editor'>
      <Editor
        height='66vh'
        width='70vw'
        defaultLanguage={lang}
        defaultValue='// start your code here'
        theme='vs-dark'
        //  onMount={(editor) => (editorRef.current = editor)}
        onChange={handleEditorChange}
      />
      <select className='select-option' value={lang} onChange={handleLang} id='lang'>
        <option value='Javascript'>JavaScript</option>
        <option value='Typescript'>TypeScript</option>
        <option value='Html'>HTML</option>
        <option value='Css'>CSS</option>
      </select>
      <input onChange={handleName} type='text' placeholder='Enter File Name' className='upload-area1'></input>
      <button className='nav-btn1' onClick={saveFile}>
        {props.loading ? 'Please Wait...' : 'Save File'}
      </button>
    </div>
  );
}
