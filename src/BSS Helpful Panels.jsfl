var dom = fl.getDocumentDOM();
var tl = dom.getTimeline();

function addCommonLayers()
{
	var layernum = tl.addNewLayer('// LABELS');
	tl.reorderLayer(layernum, 0);
	tl.layers[0].locked = true;
	
	layernum = tl.addNewLayer('// ACTIONS');
	tl.reorderLayer(layernum, 0);
	tl.layers[0].locked = true;
}

function setUpStandardButtonLayers()
{
	// actions layer
	layernum = tl.addNewLayer('// ACTIONS');
	tl.reorderLayer(layernum, 0);
	tl.setSelectedLayers(0);
	
	tl.insertKeyframe(5);
	tl.insertKeyframe(14);
	tl.insertKeyframe(15);
	tl.insertKeyframe(24);
	tl.insertKeyframe(25);
	tl.insertKeyframe(34);
	
	tl.layers[0].frames[0].actionScript = 'import com.bigspaceship.events.AnimationEvent;\ndispatchEvent(new AnimationEvent(AnimationEvent.INIT));\nstop();';
	tl.layers[0].frames[5].actionScript = 'dispatchEvent(new AnimationEvent(AnimationEvent.ROLL_OVER_START));';
	tl.layers[0].frames[14].actionScript = 'dispatchEvent(new AnimationEvent(AnimationEvent.ROLL_OVER));';
	tl.layers[0].frames[15].actionScript = 'dispatchEvent(new AnimationEvent(AnimationEvent.ROLL_OUT_START));';
	tl.layers[0].frames[24].actionScript = 'dispatchEvent(new AnimationEvent(AnimationEvent.ROLL_OUT));';
	tl.layers[0].frames[25].actionScript = 'dispatchEvent(new AnimationEvent(AnimationEvent.CLICK_START));';
	tl.layers[0].frames[34].actionScript = 'dispatchEvent(new AnimationEvent(AnimationEvent.CLICK));';
	tl.layers[0].locked = true;
	
	
	// labels layer
	var layernum = tl.addNewLayer('// LABELS');
	tl.reorderLayer(layernum, 0);
	tl.setSelectedLayers(0);
	
	tl.insertKeyframe(5);
	tl.insertKeyframe(14);
	tl.insertKeyframe(15);
	tl.insertKeyframe(24);
	tl.insertKeyframe(25);
	tl.insertKeyframe(34);
	
	tl.layers[0].frames[0].name = 'IDLE';
	tl.layers[0].frames[5].name = 'ROLL_OVER_START';
	tl.layers[0].frames[14].name = 'ROLL_OVER';
	tl.layers[0].frames[15].name = 'ROLL_OUT_START';
	tl.layers[0].frames[24].name = 'ROLL_OUT';
	tl.layers[0].frames[25].name = 'CLICK_START';
	tl.layers[0].frames[34].name = 'CLICK';
	tl.layers[0].locked = true;
}

function setUpStandardInOutLayers()
{
	
	// actions layer
	layernum = tl.addNewLayer('// ACTIONS');
	tl.reorderLayer(layernum, 0);
	tl.setSelectedLayers(0);
	tl.insertKeyframe(5);
	tl.insertKeyframe(15);
	tl.insertKeyframe(25);
	tl.insertKeyframe(35);
	tl.layers[0].frames[0].actionScript = 'import com.bigspaceship.events.AnimationEvent;\ndispatchEvent(new AnimationEvent(AnimationEvent.INIT));\nstop();';
	tl.layers[0].frames[5].actionScript = 'dispatchEvent(new AnimationEvent(AnimationEvent.IN_START));';
	tl.layers[0].frames[15].actionScript = 'stop();\ndispatchEvent(new AnimationEvent(AnimationEvent.IN));';
	tl.layers[0].frames[25].actionScript = 'dispatchEvent(new AnimationEvent(AnimationEvent.OUT_START));';
	tl.layers[0].frames[35].actionScript = 'stop();\ndispatchEvent(new AnimationEvent(AnimationEvent.OUT));';
	tl.layers[0].locked = true;
	
	// labels layer
	var layernum = tl.addNewLayer('// LABELS');
	tl.reorderLayer(layernum, 0);
	tl.setSelectedLayers(0);
	
	tl.insertKeyframe(5);
	tl.insertKeyframe(15);
	tl.insertKeyframe(25);
	tl.insertKeyframe(35);
	tl.layers[0].frames[0].name = 'INIT';
	tl.layers[0].frames[5].name = 'IN_START';
	tl.layers[0].frames[15].name = 'IN';
	tl.layers[0].frames[25].name = 'OUT_START';
	tl.layers[0].frames[35].name = 'OUT';
	tl.layers[0].locked = true;
}

function backupSelectedLayer()
{
	var selectedLayers = tl.getSelectedLayers();
	if(selectedLayers.length > 1){
		return "Please select only 1 layer to backup.";
	}
	
	//var layerObjs = [];
	//for(var j=0; j<selectedLayers.length; j++){
	//	layerObjs[j] = tl.layers[selectedLayers[i];
	//}
	
	for(var i=0; i<selectedLayers.length; i++){
		tl.setSelectedLayers(selectedLayers[i]);
		
		var layerToDup = tl.layers[selectedLayers[i]];
		tl.copyFrames(0, layerToDup.frameCount);
	
		var layernum = tl.addNewLayer('[backup] '+layerToDup.name, 'guide', false);
		tl.layers[layernum].locked = true;
		tl.layers[layernum].visible = false;
		tl.pasteFrames(0, layerToDup.frameCount);
	
		tl.removeFrames(layerToDup.frameCount, tl.layers[layernum].frameCount);
		tl.setSelectedLayers(layernum);
	}
}

function convertToStopFrames()
{
	tl.convertToKeyframes();
	tl.setFrameProperty("actionScript", "stop();");
}

function toggleGuidedLayers()
{
	var selectedLayers = tl.getSelectedLayers();
	
	for(var i=0; i<selectedLayers.length; i++){
		var sel = selectedLayers[i];
		
		if(tl.layers[sel].layerType == "guide"){
			tl.layers[sel].layerType = "normal";
		}else{
			tl.layers[sel].layerType = "guide";
		}
	}
	
	// deselect layers, then reselect
	tl.setSelectedLayers(selectedLayers[0]);
	for(var j=1; j<selectedLayers.length; j++){
		tl.setSelectedLayers(selectedLayers[j], false);
	}
}

function renameInstances(newName)
{
	if(newName == ""){
		var proceed = confirm("Remove name from all instances on this layer?");
		if(!proceed) return;
	}
	var selectedLayers = tl.getSelectedLayers();
	if(selectedLayers.length > 1){return "Please only select one layer."}
	
	var instanceCounter=0;
	var l = tl.layers[selectedLayers[0]];
	
	for(var i=0; i<l.frames.length; i++){
		if(l.frames[i].elements.length && l.frames[i].startFrame == i){  // basically check if it is a keyframe with elements in it
			instanceCounter++;
			l.frames[i].elements[0].name = newName.toString();
		}	
	}
	dom.selectNone();
	
	if(instanceCounter == 1) return instanceCounter+" instance renamed.";
	return instanceCounter+" instances renamed.";
}

function prefixLibItems(prefix)
{
	if(prefix==""){	return "Please speficy a prefix."; }
	
	var items = dom.library.getSelectedItems();
	for(var i=0; i<items.length; i++){
		var str = items[i].name.toString().substr(items[i].name.toString().indexOf("/")+1);
		items[i].name = prefix+str;
	}
	
	if(items.length == 1) return items.length+" item altered.";
	return items.length+" items altered.";
}

function swapLayer()
{
	var selectedLayers = tl.getSelectedLayers();

	if(dom.selection.length == 0) return "Please select an item on the stage to swap.";
	if(dom.library.getSelectedItems().length > 1) return "Please only select one item in the library.";
	if(selectedLayers.length > 1){return "Please only select one layer."}
	
	var nameToSwitchIn = dom.library.getSelectedItems()[0].name;
	var instanceCounter=0;
	var l = tl.layers[selectedLayers[0]];	
	for(var i=0; i<l.frames.length; i++){
		if(l.frames[i].elements.length && l.frames[i].startFrame == i){  // basically check if it is a keyframe with elements in it
			instanceCounter++;
			tl.currentFrame = i;
			dom.selectNone();
			dom.selectAll();
			dom.swapElement(nameToSwitchIn);
		}
	}
	
	dom.selectNone();
	
	if(instanceCounter == 1) return instanceCounter+" instance replaced.";
	return instanceCounter+" instances replaced.";
}

function swapSymbol()
{
	if(dom.selection.length == 0) return "Please select an item on the stage to swap.";
	if(dom.library.getSelectedItems().length > 1) return "Please only select one item in the library.";
	dom.swapElement(dom.library.getSelectedItems()[0].name);
}
