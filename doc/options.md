## Index Options

<table>
    <tr></tr>
    <tr>
        <td>Option</td>
        <td>Values</td>
        <td>Description</td>
        <td>Default</td>
    </tr>
    <tr>
        <td>preset</td>
        <td>
            "memory"<br>
            "performance"<br>
            "match"<br>
            "score"<br>
            "default"
        </td>
        <td>
            The <a href="#presets">configuration profile</a> as a shortcut or as a base for your custom settings.<br>
        </td>
        <td>"default"</td>
    </tr>
    <tr></tr>
    <tr>
        <td>tokenize</td>
        <td>
            "strict", "exact"<br>
            "forward"<br>
            "reverse", "bidirectional<br>
            "full"
        </td>
        <td>
            The <a href="#tokenizer">indexing mode (tokenizer)</a>.<br><br>Choose one of the <a href="#tokenizer">built-ins</a> or pass a <a href="#flexsearch.tokenizer">custom tokenizer function</a>.<br>
        </td>
        <td>"strict"</td>
    </tr>
    <tr></tr>
    <tr>
        <td>cache</td>
        <td>
            Boolean<br>
            Number
        </td>
        <td>Enable/Disable and/or set capacity of cached entries.<br><br>When passing a number as a limit the <b>cache automatically balance stored entries related to their popularity</b>.<br><br>Note: When just using "true" the cache has no limits and growth unbounded.</td>
        <td>false</td>
    </tr>
    <tr></tr>
    <tr>
        <td>resolution</td>
        <td>
            Number
        </td>
        <td>Sets the scoring resolution (default: 9).</td>
        <td>9</td>
    </tr>
    <tr></tr>
    <tr>
        <td>context</td>
        <td>
            Boolean<br>
            Context Options
        </td>
        <td>Enable/Disable <a href="#contextual">contextual indexing</a>. When passing "true" as value it will take the default values for the context.</td>
        <td>false</td>
    </tr>
    <tr></tr>
    <tr>
        <td>optimize</td>
        <td>
            Boolean
        </td>
        <td>When enabled it uses a memory-optimized stack flow for the index.</td>
        <td>true</td>
    </tr>
    <tr></tr>
    <tr>
        <td>boost</td>
        <td>
            function(arr, str, int) => float
        </td>
        <td>A custom boost function used when indexing contents to the index. The function has this signature: <code>Function(words[], term, index) => Float</code>. It has 3 parameters where you get an array of all words, the current term and the current index where the term is placed in the word array. You can apply your own calculation e.g. the occurrences of a term and return this factor (<1 means relevance is lowered, >1 means relevance is increased).<br><br>Note: this feature is currently limited by using the tokenizer "strict" only.</td>
        <td>null</td>
    </tr>
    <tr>
        <td colspan="4">
            Language-specific Options and Encoding:
        </td>
    </tr>
    <tr>
        <td>charset<br><br></td>
        <td>
            Charset Payload<br>
            String (key)
        </td>
        <td vertical-align="top">
            Provide a custom charset payload or pass one of the keys of built-in charsets.
        </td>
        <td>"latin"</td>
    </tr>
    <tr></tr>
    <tr>
        <td>language<br><br></td>
        <td>
            Language Payload<br>
            String (key)
        </td>
        <td vertical-align="top">
            Provide a custom language payload or pass in language shorthand flag (ISO-3166) of built-in languages.
        </td>
        <td>null</td>
    </tr>
    <tr></tr>
    <tr>
        <td>encode<br><br><br><br><br><br><br></td>
        <td>
            false<br>
            "default"<br>
            "simple"<br>
            "balance"<br>
            "advanced"<br>
            "extra"<br>
            function(str) => [words]
        </td>
        <td>The encoding type.<br><br>Choose one of the <a href="#phonetic">built-ins</a> or pass a <a href="#flexsearch.encoder">custom encoding function</a>.</td>
        <td>"default"</td>
    </tr>
    <tr></tr>
    <tr>
        <td>stemmer<br><br><br></td>
        <td>
            false<br>
            String<br>
            Function
        </td>
        <td></td>
        <td>false</td>
    </tr>
    <tr></tr>
    <tr>
        <td>filter<br><br><br></td>
        <td>
            false<br>
            String<br>
            Function
        </td>
        <td></td>
        <td>false</td>
    </tr>
    <tr></tr>
    <tr>
        <td>matcher<br><br><br></td>
        <td>
            false<br>
            String<br>
            Function
        </td>
        <td></td>
        <td>false</td>
    </tr>
    <tr>
        <td colspan="4">
            Additional Options for Document Indexes:
        </td>
    </tr>
    <tr>
        <td>worker<br></td>
        <td>
            Boolean
        </td>
        <td>Enable/Disable and set count of running worker threads.</td>
        <td>false</td>
    </tr>
    <tr></tr>
    <tr>
        <td>document<br></td>
        <td>Document Descriptor</td>
        <td vertical-align="top">
            Includes definitions for the document index and storage.
        </td>
        <td></td>
    </tr>
</table>

## Context Options

<table>
    <tr></tr>
    <tr>
        <td>Option</td>
        <td>Values</td>
        <td>Description</td>
        <td>Default</td>
    </tr>
    <tr>
        <td>resolution</td>
        <td>
            Number
        </td>
        <td>Sets the scoring resolution for the context (default: 1).</td>
        <td>1</td>
    </tr>
    <tr></tr>
    <tr>
        <td>depth<br><br></td>
        <td>
            false<br>
            Number
        </td>
        <td>Enable/Disable <a href="#contextual">contextual indexing</a> and also sets contextual distance of relevance. Depth is the maximum number of words/tokens away a term to be considered as relevant.</td>
        <td>1</td>
    </tr>
    <tr></tr>
    <tr>
        <td>bidirectional</td>
        <td>
            Boolean
        </td>
        <td>Sets bidirectional search result. If enabled and the source text contains "red hat", it will be found for queries "red hat" and "hat red".</td>
        <td>true</td>
    </tr>
</table>

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
