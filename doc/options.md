
## Document Options

<table>
    <tr><td colspan="4"></td></tr>
    <tr>
        <td>Option</td>
        <td>Values</td>
        <td>Description</td>
        <td>Default</td>
    </tr>
    <tr>
        <td>id<br></td>
        <td>String</td>
        <td vertical-align="top"></td>
        <td>"id""</td>
    </tr>
    <tr></tr>
    <tr>
        <td>tag<br><br></td>
        <td>false<br>String</td>
        <td vertical-align="top"></td>
        <td>"tag"</td>
    </tr>
    <tr></tr>
    <tr>
        <td>index<br><br><br></td>
        <td>String<br>Array&lt;String><br>Array&lt;Object></td>
        <td vertical-align="top"></td>
        <td></td>
    </tr>
    <tr></tr>
    <tr>
        <td>store<br><br><br></td>
        <td>Boolean<br>String<br>Array&lt;String></td>
        <td vertical-align="top"></td>
        <td>false</td>
    </tr>
</table>

## Encoder Options

<table>
    <tr><td colspan="4"></td></tr>
    <tr>
        <td>Option</td>
        <td>Values</td>
        <td>Description</td>
        <td>Default</td>
    </tr>
    <tr>
        <td>split<br><br></td>
        <td>
            false<br>
            RegExp<br>
            String
        </td>
        <td vertical-align="top">
            The rule to split words when using non-custom tokenizer (<a href="#tokenizer">built-ins</a> e.g. "forward"). Use a string/char or use a regular expression (default: <code>/\W+/</code>).<br>
        </td>
        <td><code>/[\W_]+/</code></td>
    </tr>
    <tr></tr>
    <tr>
        <td>rtl<br></td>
        <td>
            Boolean
        </td>
        <td>Enables Right-To-Left encoding.</td>
        <td>false</td>
    </tr>
    <tr></tr>
    <tr>
        <td>encode<br></td>
        <td>
            function(str) => [words]
        </td>
        <td>The custom encoding function.</td>
        <td>/lang/latin/default.js</td>
    </tr>
    <tr>
        <td>stemmer<br><br><br></td>
        <td>
            false<br>
            String<br>
            Function
        </td>
        <td>Disable or pass in language shorthand flag (ISO-3166) or a custom object.
    </tr>
    <tr></tr>
    <tr>
        <td>filter<br><br><br></td>
        <td>
            false<br>
            String<br>
            Function
        </td>
        <td>Disable or pass in language shorthand flag (ISO-3166) or a custom array.</td>
    </tr>
    <tr></tr>
    <tr>
        <td>matcher<br><br><br></td>
        <td>
            false<br>
            String<br>
            Function
        </td>
        <td>Disable or pass in language shorthand flag (ISO-3166) or a custom array.</td>
    </tr>
</table>

## Search Options

<table>
    <tr><td colspan="4"></td></tr>
    <tr>
        <td>Option</td>
        <td>Values</td>
        <td>Description</td>
        <td>Default</td>
    </tr>
    <tr>
        <td>limit</td>
        <td>number</td>
        <td>Sets the limit of results.</td>
        <td>100</td>
    </tr>
    <tr></tr>
    <tr>
        <td>offset</td>
        <td>number</td>
        <td>Apply offset (skip items).</td>
        <td>0</td>
    </tr>
    <tr></tr>
    <tr>
        <td>suggest</td>
        <td>Boolean</td>
        <td>Enables <a href="#suggestions">suggestions</a> in results.</td>
        <td>false</td>
    </tr>
</table>

## Document Search Options

<table>
    <tr><td colspan="4"></td></tr>
    <tr>
        <td>Option</td>
        <td>Values</td>
        <td>Description</td>
        <td>Default</td>
    </tr>
    <tr>
        <td>index</td>
        <td>String<br>Array&lt;String&gt;<br>Array&lt;Object&gt;</td>
        <td>Sets the <a href="#docs">document fields</a> which should be searched. When no field is set, all fields will be searched. <a href="#options-field-search">Custom options per field</a> are also supported.</td>
        <td></td>
    </tr>
    <tr></tr>
    <tr>
        <td>tag</td>
        <td>String<br>Array&lt;String></td>
        <td>Sets the <a href="#docs">document fields</a> which should be searched. When no field is set, all fields will be searched. <a href="#options-field-search">Custom options per field</a> are also supported.</td>
        <td>false</td>
    </tr>
    <tr></tr>
    <tr>
        <td>enrich</td>
        <td>Boolean</td>
        <td>Enrich IDs from the results with the corresponding documents.</td>
        <td>false</td>
    </tr>
    <tr></tr>
    <tr>
        <td>bool</td>
        <td>"and"<br>"or"</td>
        <td>Sets the used <a href="#operators">logical operator</a> when searching through multiple fields or tags.</td>
        <td>"or"</td>
    </tr>
</table>
