import ToolPage from '../lib/ToolPage.svelte';
import {tools} from '../tools.js';
import { mount } from 'svelte'

const toolName = "telescopics";
const tool = tools.find(t => t.name === toolName);

const app = mount(ToolPage, {
  target: document.getElementById('app'),
  props: tool 
});

export default app;

