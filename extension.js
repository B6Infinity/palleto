const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */


console.log('Running "palleto"');


let palleteData = {};


function activate(context) {
	initPallete();
	

	context.subscriptions.push(vscode.commands.registerCommand('palleto.init', function () {
		initPallete();
	})); // This is How to add commands
	


	context.subscriptions.push(vscode.commands.registerCommand('palleto.openPanel', function () {
		const panel = vscode.window.createWebviewPanel(
			'pallete', // Identifies the type of the webview. Used internally
			'Pallete', // Title of the panel displayed to the user
			vscode.ViewColumn.Beside, // Editor column to show the new webview panel in.
			{
				enableScripts: true
			} // Webview options. More on these later.
		);
		panel.webview.html = getWebviewContent();
	}));

	// eslint-disable-next-line no-undef
	panel.webview.onDidReceiveMessage(
        message => {
			console.log(message);
          switch (message.command) {
            case 'alert':
              vscode.window.showErrorMessage(message.text);
              return;
          }
        },
        undefined,
        context.subscriptions
    
	); // This is How to add commands
	

	
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}

function getWebviewContent(){

	vscode.workspace.findFiles('*.pallete').then((value) => {
		let palletes = value;
		if(palletes.length == 0){
			// Create .pallete File
			// 
			// 
		}else{
			// Open and read pallete file
			let palleteFile = palletes[0];

			vscode.workspace.openTextDocument(palleteFile).then((document) => {
				palleteData = JSON.parse(document.getText());
				
			});
		}
	});
	// console.log(palleteData, "OUT");


	let colorNodes__HTML = ``;

	for (let color in palleteData) {
		// console.log(color);
		colorNodes__HTML += `
		<div class="color-node" onclick="copyHexToClipBoard(this);" style="background-color: ${color}">
			<div class="copy2clipboard">
				<div class="colorhex">${color}</div>
				<div class="copy2clipboard_prompt" style="text-align: center;">Copy to Clipboard</div>
			</div>
		</div>

		`;
	}
	
	return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Cat Coding</title>
	</head>
	<body>
		<h1>${vscode.workspace.name} Pallete</h1>
	
		<div class="colorCarousel">
	
			${colorNodes__HTML}
			
	
		</div>

        <button onclick="addColor()">Add Color</button>

		<div id="txtcmd">stuff</div>
		

	</body>
	<style>
		*{
			color: white;
			font-family: 'Arial';
	
			/* DEBUGGING */
			/* background-color: rgba(179, 255, 0, 0.421); */
		}
		html, body{
			background: rgb(20, 20, 20);
		}
		.colorCarousel{
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			/* background-color: aqua; */
			margin: 10px;
			padding: 10px;
		}
	
		.color-node:hover{
		opacity: 0.8;
		}
		.color-node{
			background-color: #5db820;
			/* height: 100px; */
			width: 100px;
			border-radius: 5px;
			padding: 10px;
			margin: 20px;
		}
		
		.copy2clipboard{
			display: flex;
			flex-direction: column;
			justify-content: space-evenly;
			align-items: center;
		}
		.colorhex{
			font-size: 20px;
			padding: 20px;
			font-weight: 700;
			text-shadow: 5px 5px 5px black;
		}
		.copy2clipboard_prompt{
			margin: 10px;
			color: white;
			text-shadow: 5px 5px 5px black;
			visibility: hidden;
			user-select: none;
		}
		.copy2clipboard:hover .copy2clipboard_prompt{
			visibility: visible;
		}

        button{
            background-color: black;
            padding: 10px;
            font-size: 20px;
            border-radius: 5px;
        }
		
	</style>
	<script>
		function copyHexToClipBoard(colorNode){
			let color = window.getComputedStyle( colorNode ,null).getPropertyValue('background-color').replace('rgb(','');
			// console.log(color);
			let hex = rgb2hex(color.replace(')', ''));
			console.log(hex);
			
			// navigator.clipboard.writeText(hex);
			unsecuredCopyToClipboard(hex);
		}
	
		function rgb2hex(color){
			let comma_at = color.indexOf(',');
			
			let r = Number(color.slice(0, comma_at));
			
			color = color.replace(r.toString()+',', '');
			comma_at = color.indexOf(',');
			let g = Number(color.slice(0, comma_at));
			color = color.replace(g.toString()+',', '');
			comma_at = color.indexOf(',');
			
			let b = Number(color);
	
			return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	
		}
		
		function unsecuredCopyToClipboard(text) {
			const textArea = document.createElement("textarea");
			textArea.value = text;
			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();
			try {
				document.execCommand('copy');
			} catch (err) {
				console.error('Unable to copy to clipboard', err);
			}
			document.body.removeChild(textArea);
		}


		
        const vscode = acquireVsCodeApi();

		function addColor(){
            // Ask Backend to add color
			try{
			vscode.postMessage({
				command: 'alert',
				text: '🐛 Add Color'
			})
			}catch(err) {
				document.getElementById("txtcmd").innerHTML = err.message;
			  }
        }

	</script>
	</html>
	`;
}

function initPallete(){
	// Get Or Create .pallete file		
	vscode.workspace.findFiles('*.pallete').then((value) => {
		let palletes = value;
		if(palletes.length == 0){
			// Create .pallete File
			// 
			// 
		}else{
			// Open and read pallete file
			let palleteFile = palletes[0];

			vscode.workspace.openTextDocument(palleteFile).then((document) => {
				palleteData = JSON.parse(document.getText());				
				vscode.window.showInformationMessage(`Initialised Pallete. ${Object.keys(palleteData).length} colors found`, 'Open Pallete').then(
					(value) => {
						if (value) {
							openPalletePanel();
						}
					});
			});
		}
	});
}
