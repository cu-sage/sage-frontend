/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Testing blocks for Blockly.
 */
'use strict';

goog.provide('Blockly.Blocks.testing');
goog.require('Blockly.Blocks');

Blockly.Blocks['expect'] = {
  init: function() {
    this.appendValueInput("NAME")
        .setCheck("actual")
        .appendField("Expect");
    this.setNextStatement(true, ["trigger_pass", "trigger_fail"]);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['trigger_pass'] = {
  init: function() {
    this.appendValueInput("action")
        .setCheck(["action_say", "action_add_points", "action_block_include", "action_block_exclude"])
        .appendField("If pass");
    this.setPreviousStatement(true, ["trigger_pass", "trigger_fail", "expect"]);
    this.setNextStatement(true, ["trigger_pass", "trigger_fail"]);
    this.setColour(65);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['trigger_fail'] = {
  init: function() {
    this.appendValueInput("action")
        .setCheck(["action_say", "action_block_include", "action_block_exclude"])
        .appendField("If fail");
    this.setPreviousStatement(true, ["trigger_pass", "trigger_fail", "expect"]);
    this.setNextStatement(true, ["trigger_pass", "trigger_fail"]);
    this.setColour(65);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['action_say'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Say \"")
        .appendField(new Blockly.FieldTextInput(""), "say_text")
        .appendField("\"");
    this.setOutput(true, "action_say");
    this.setColour(20);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['action_add_points'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Add points")
        .appendField(new Blockly.FieldNumber("0", 0, 500, 1), "point_value");
    this.setOutput(true, "action_add_points");
    this.setColour(20);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};


/*Blockly.Blocks['action_add_points'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Add points")
        .appendField(new Blockly.FieldTextInput(""), "point_value");
    this.setOutput(true, "action_add_points");
    this.setColor(20);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com');
  }
};*/

Blockly.Blocks['action_block_include'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Include block")
        .appendField(new Blockly.FieldTextInput(""), "block_name");
    this.setOutput(true, "action_block_include");
    this.setColour(20);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['action_block_exclude'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Exclude block")
        .appendField(new Blockly.FieldTextInput(""), "block_name");
    this.setOutput(true, "action_block_exclude");
    this.setColour(20);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['actual_sprite'] = {
  init: function() {
    this.appendValueInput("actual")
        .setCheck(["assert_should", "assert_should_not"])
        .appendField("Sprite")
        .appendField(new Blockly.FieldTextInput(""), "NAME");
    this.setOutput(true, "actual");
    this.setColour(290);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};



Blockly.Blocks['actual_block'] = {
  init: function() {
    this.appendValueInput("assert")
        .setCheck(["assert_should", "assert_should_not"])
        .appendField("Block")
        .appendField(new Blockly.FieldTextInput(""), "NAME");
    this.setOutput(true, "actual");
    this.setColour(290);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['actual_block_type'] = {
  init: function() {
    this.appendValueInput("assert")
        .setCheck(["assert_should", "assert_should_not"])
        .appendField("Block Type")
        .appendField(new Blockly.FieldTextInput(""), "NAME");
    this.setOutput(true, "actual");
    this.setColour(290);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['assert_should'] = {
  init: function() {
    this.appendValueInput("matcher")
        .setCheck(["matcher_be_present", "matcher_be_on", "matcher_point_direction", "matcher_move_steps", "matcher_say"])
        .appendField("Should");
    this.setOutput(true, "assert_should");
    this.setColour(210);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['assert_should_not'] = {
  init: function() {
    this.appendValueInput("matcher")
        .setCheck(["matcher_be_present", "matcher_be_on", "matcher_point_direction", "matcher_move_steps", "matcher_say"])
        .appendField("Should not");
    this.setOutput(true, "assert_should_not");
    this.setColour(210);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['matcher_be_present'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Be present");
    this.setOutput(true, "matcher_be_present");
    this.setColour(160);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['matcher_be_on'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Be on x:")
        .appendField(new Blockly.FieldTextInput(""), "x")
        .appendField("y:")
        .appendField(new Blockly.FieldTextInput(""), "y");
    this.setOutput(true, "matcher_be_on");
    this.setColour(160);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['matcher_point_direction'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Point in direction:")
        .appendField(new Blockly.FieldDropdown([["right", "direction_right"], ["left", "direction_left"], ["up", "direction_up"], ["down", "direction_down"]]), "direction");
    this.setOutput(true, "matcher_point_direction");
    this.setColour(160);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['matcher_move_steps'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Move")
        .appendField(new Blockly.FieldTextInput(""), "move_step_count")
        .appendField("steps");
    this.setOutput(true, "matcher_move_steps");
    this.setColour(160);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['matcher_say'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Say")
        .appendField(new Blockly.FieldTextInput(""), "say_what");
    this.setOutput(true, "matcher_say");
    this.setColour(160);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['actual_key_pressed'] = {
  init: function() {
    this.appendValueInput("assert")
        .setCheck(["assert_should", "assert_should_not"])
        .appendField("When")
        .appendField(new Blockly.FieldDropdown([["w", "w"], ["a", "a"], ["s", "s"], ["d", "d"]]), "key_pressed")
        .appendField("key pressed, sprite")
        .appendField(new Blockly.FieldTextInput(""), "key_sprite");
    this.setOutput(true, "actual");
    this.setColour(290);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['actual_sprite_touch_sprite'] = {
  init: function() {
    this.appendValueInput("assert")
        .setCheck(["assert_should", "assert_should_not"])
        .appendField("When sprite")
        .appendField(new Blockly.FieldTextInput(""), "key_sprite_1")
        .appendField("touching sprite")
        .appendField(new Blockly.FieldTextInput(""), "key_sprite_2");
    this.setOutput(true, "actual");
    this.setColour(290);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['actual_sprite_touch_color'] = {
  init: function() {
    this.appendValueInput("assert")
        .setCheck(["assert_should", "assert_should_not"])
        .appendField("When sprite")
        .appendField(new Blockly.FieldTextInput(""), "key_sprite")
        .appendField("touching color")
        .appendField(new Blockly.FieldDropdown([["red", "red"], ["orange", "orange"], ["yellow", "yellow"], ["green", "green"], ["blue", "blue"], ["indigo", "indigo"], ["violet", "violet"]]), "color");
    this.setOutput(true, "actual");
    this.setColour(290);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};