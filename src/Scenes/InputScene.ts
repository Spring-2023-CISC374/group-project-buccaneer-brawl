import Phaser from 'phaser';
import { generateResponse } from '../Classes/chatgptrequest';
import available_moves from "../Types/available_moves";

export default class InputScene extends Phaser.Scene {
  private savedText: string;
  private p1_responseText: string[];
  private moveMap: Map<string, string>;

  constructor() {
    super({key: 'InputScene'});
    this.savedText = '';
    this.p1_responseText = ["random"];

    this.moveMap = available_moves.reduce((accumulator, curr) => {
      accumulator.set(curr, "true");
      return accumulator;
    }, new Map<string, string>());

  }

  create() {
    this.cameras.main.setBackgroundColor('#ffffff');

    this.add.text(10, 10, 'Enter your text:', {
      fontSize: '32px',
      color: '#000',
    });

    const input = document.createElement("input");
    input.id = "myText"
    input.type = "text";
    input.className = "css-class-name"; // set the CSS class
    document.body.appendChild(input);

    const map = available_moves.reduce((accumulator, curr) => {
      accumulator.set(curr, "true");
      return accumulator;
    }, new Map<string, string>());


   // const inputForm = document.getElementById('inputForm') as HTMLFormElement;
    //inputForm.style.display = 'block';


    const submitButton = this.add.text(200, 200, 'Submit', {
      fontSize: '32px',
      color: '#000',
      backgroundColor: '#fff',
      padding: { left: 10, right: 10, top: 5, bottom: 5 },
    });

    submitButton.setInteractive({ useHandCursor: true });

    submitButton.on('pointerdown', () => {
      this.saveInput();
    });
  }

  saveInput() {
    const inputElement = document.getElementById(
      'myText'
    ) as HTMLInputElement;
    this.savedText = inputElement.value;
    console.log('Saved text: ', this.savedText);

    inputElement.value = '';

    const inputForm = document.getElementById('inputForm') as HTMLFormElement;
   // inputForm.style.display = 'none';

      // Usage:
    generateResponse(this.savedText).then((generatedText) => {
      console.log(generatedText);
      this.p1_responseText = this.formatRequest(generatedText);
      this.scene.start('FightScene', {
        "p1_responseText": this.p1_responseText
      });
    });
   
  }


  formatRequest(resposneText: string | undefined): string[] {

    if(resposneText == undefined) {
      return ["random"];
    }

    const beginSubstring = resposneText.indexOf("[");
    const endSubstring = resposneText.indexOf("]");

    if(beginSubstring == undefined || endSubstring == undefined) {
      return ["random"];
    }

    const subText = resposneText.substring(beginSubstring + 1, endSubstring);
    const map = this.moveMap;
    console.log("map" , map);

    const splitText = subText.split(',').map(function(item) {
      if(map.has(item.trim())) {
        return item.trim();
      }
      return "random"

    });
    console.log("splitText", splitText);
    return splitText;

  }
}
