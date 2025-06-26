let wasm;

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_2.set(idx, obj);
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => {
    wasm.__wbindgen_export_6.get(state.dtor)(state.a, state.b)
});

function makeClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        try {
            return f(state.a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_6.get(state.dtor)(state.a, state.b);
                state.a = 0;
                CLOSURE_DTORS.unregister(state);
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_6.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state);
            } else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}
function __wbg_adapter_28(arg0, arg1, arg2) {
    wasm.closure299_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_33(arg0, arg1, arg2) {
    wasm.closure346_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_44(arg0, arg1, arg2) {
    wasm.closure366_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_47(arg0, arg1, arg2) {
    wasm.closure394_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_344(arg0, arg1, arg2, arg3) {
    wasm.closure411_externref_shim(arg0, arg1, arg2, arg3);
}

const __wbindgen_enum_ReadableStreamType = ["bytes"];

const IntoUnderlyingByteSourceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_intounderlyingbytesource_free(ptr >>> 0, 1));

export class IntoUnderlyingByteSource {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IntoUnderlyingByteSourceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_intounderlyingbytesource_free(ptr, 0);
    }
    /**
     * @returns {ReadableStreamType}
     */
    get type() {
        const ret = wasm.intounderlyingbytesource_type(this.__wbg_ptr);
        return __wbindgen_enum_ReadableStreamType[ret];
    }
    /**
     * @returns {number}
     */
    get autoAllocateChunkSize() {
        const ret = wasm.intounderlyingbytesource_autoAllocateChunkSize(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {ReadableByteStreamController} controller
     */
    start(controller) {
        wasm.intounderlyingbytesource_start(this.__wbg_ptr, controller);
    }
    /**
     * @param {ReadableByteStreamController} controller
     * @returns {Promise<any>}
     */
    pull(controller) {
        const ret = wasm.intounderlyingbytesource_pull(this.__wbg_ptr, controller);
        return ret;
    }
    cancel() {
        const ptr = this.__destroy_into_raw();
        wasm.intounderlyingbytesource_cancel(ptr);
    }
}

const IntoUnderlyingSinkFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_intounderlyingsink_free(ptr >>> 0, 1));

export class IntoUnderlyingSink {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IntoUnderlyingSinkFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_intounderlyingsink_free(ptr, 0);
    }
    /**
     * @param {any} chunk
     * @returns {Promise<any>}
     */
    write(chunk) {
        const ret = wasm.intounderlyingsink_write(this.__wbg_ptr, chunk);
        return ret;
    }
    /**
     * @returns {Promise<any>}
     */
    close() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.intounderlyingsink_close(ptr);
        return ret;
    }
    /**
     * @param {any} reason
     * @returns {Promise<any>}
     */
    abort(reason) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.intounderlyingsink_abort(ptr, reason);
        return ret;
    }
}

const IntoUnderlyingSourceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_intounderlyingsource_free(ptr >>> 0, 1));

export class IntoUnderlyingSource {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IntoUnderlyingSourceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_intounderlyingsource_free(ptr, 0);
    }
    /**
     * @param {ReadableStreamDefaultController} controller
     * @returns {Promise<any>}
     */
    pull(controller) {
        const ret = wasm.intounderlyingsource_pull(this.__wbg_ptr, controller);
        return ret;
    }
    cancel() {
        const ptr = this.__destroy_into_raw();
        wasm.intounderlyingsource_cancel(ptr);
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_addEventListener_90e553fdce254421 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.addEventListener(getStringFromWasm0(arg1, arg2), arg3);
    }, arguments) };
    imports.wbg.__wbg_addTo_4c3462c91060f881 = function(arg0, arg1) {
        const ret = arg0.addTo(arg1);
        return ret;
    };
    imports.wbg.__wbg_bindPopup_99a8f36daa4ff48f = function(arg0, arg1) {
        const ret = arg0.bindPopup(arg1);
        return ret;
    };
    imports.wbg.__wbg_body_942ea927546a04ba = function(arg0) {
        const ret = arg0.body;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_bringToBack_3b74d43f0b863310 = function(arg0) {
        const ret = arg0.bringToBack();
        return ret;
    };
    imports.wbg.__wbg_bringToFront_b8203ccde256929d = function(arg0) {
        const ret = arg0.bringToFront();
        return ret;
    };
    imports.wbg.__wbg_buffer_09165b52af8c5237 = function(arg0) {
        const ret = arg0.buffer;
        return ret;
    };
    imports.wbg.__wbg_buffer_609cc3eee51ed158 = function(arg0) {
        const ret = arg0.buffer;
        return ret;
    };
    imports.wbg.__wbg_byobRequest_77d9adf63337edfb = function(arg0) {
        const ret = arg0.byobRequest;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_byteLength_e674b853d9c77e1d = function(arg0) {
        const ret = arg0.byteLength;
        return ret;
    };
    imports.wbg.__wbg_byteOffset_fd862df290ef848d = function(arg0) {
        const ret = arg0.byteOffset;
        return ret;
    };
    imports.wbg.__wbg_call_672a4d21634d4a24 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.call(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_call_7cccdd69e0791ae2 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.call(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_cancelBubble_2e66f509cdea4d7e = function(arg0) {
        const ret = arg0.cancelBubble;
        return ret;
    };
    imports.wbg.__wbg_cloneNode_a8ce4052a2c37536 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.cloneNode(arg1 !== 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_cloneNode_e35b333b87d51340 = function() { return handleError(function (arg0) {
        const ret = arg0.cloneNode();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_close_304cc1fef3466669 = function() { return handleError(function (arg0) {
        arg0.close();
    }, arguments) };
    imports.wbg.__wbg_close_5ce03e29be453811 = function() { return handleError(function (arg0) {
        arg0.close();
    }, arguments) };
    imports.wbg.__wbg_composedPath_977ce97a0ef39358 = function(arg0) {
        const ret = arg0.composedPath();
        return ret;
    };
    imports.wbg.__wbg_content_537e4105afcd9cee = function(arg0) {
        const ret = arg0.content;
        return ret;
    };
    imports.wbg.__wbg_createComment_8b540d4b9d22f212 = function(arg0, arg1, arg2) {
        const ret = arg0.createComment(getStringFromWasm0(arg1, arg2));
        return ret;
    };
    imports.wbg.__wbg_createElementNS_914d752e521987da = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        const ret = arg0.createElementNS(arg1 === 0 ? undefined : getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createElement_8c9931a732ee2fea = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.createElement(getStringFromWasm0(arg1, arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createTextNode_42af1a9f21bb3360 = function(arg0, arg1, arg2) {
        const ret = arg0.createTextNode(getStringFromWasm0(arg1, arg2));
        return ret;
    };
    imports.wbg.__wbg_deleteProperty_96363d4a1d977c97 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.deleteProperty(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_disable_6d6140ef358fd36d = function(arg0) {
        const ret = arg0.disable();
        return ret;
    };
    imports.wbg.__wbg_document_d249400bd7bd996d = function(arg0) {
        const ret = arg0.document;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_dragging_ba95444d1a88d951 = function(arg0) {
        const ret = arg0.dragging;
        return ret;
    };
    imports.wbg.__wbg_enable_6488dd2e6af4261b = function(arg0) {
        const ret = arg0.enable();
        return ret;
    };
    imports.wbg.__wbg_enqueue_bb16ba72f537dc9e = function() { return handleError(function (arg0, arg1) {
        arg0.enqueue(arg1);
    }, arguments) };
    imports.wbg.__wbg_error_524f506f44df1645 = function(arg0) {
        console.error(arg0);
    };
    imports.wbg.__wbg_firstElementChild_d75d385f5abd1414 = function(arg0) {
        const ret = arg0.firstElementChild;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_getPropertyValue_e623c23a05dfb30c = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = arg1.getPropertyValue(getStringFromWasm0(arg2, arg3));
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_getRandomValues_38097e921c2494c3 = function() { return handleError(function (arg0, arg1) {
        globalThis.crypto.getRandomValues(getArrayU8FromWasm0(arg0, arg1));
    }, arguments) };
    imports.wbg.__wbg_getTime_46267b1c24877e30 = function(arg0) {
        const ret = arg0.getTime();
        return ret;
    };
    imports.wbg.__wbg_get_67b2ba62fc30de12 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.get(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_get_b9b93047fe3cf45b = function(arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return ret;
    };
    imports.wbg.__wbg_host_166cb082dae71d08 = function(arg0) {
        const ret = arg0.host;
        return ret;
    };
    imports.wbg.__wbg_id_c65402eae48fb242 = function(arg0, arg1) {
        const ret = arg1.id;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_insertBefore_c181fb91844cd959 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.insertBefore(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_Element_0af65443936d5154 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Element;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_ShadowRoot_726578bcd7fa418a = function(arg0) {
        let result;
        try {
            result = arg0 instanceof ShadowRoot;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Window_def73ea0955fc569 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Window;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_lat_dab9264ff88fd033 = function(arg0) {
        const ret = arg0.lat;
        return ret;
    };
    imports.wbg.__wbg_latlng_808fc05a3d6510cc = function(arg0) {
        const ret = arg0.latlng;
        return ret;
    };
    imports.wbg.__wbg_length_a446193dc22c12f8 = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_lng_bf085f7594a75eb2 = function(arg0) {
        const ret = arg0.lng;
        return ret;
    };
    imports.wbg.__wbg_locate_394595e4b2d1b985 = function(arg0, arg1) {
        const ret = arg0.locate(arg1);
        return ret;
    };
    imports.wbg.__wbg_log_c222819a41e063d3 = function(arg0) {
        console.log(arg0);
    };
    imports.wbg.__wbg_new0_f788a2397c7ca929 = function() {
        const ret = new Date();
        return ret;
    };
    imports.wbg.__wbg_new_23a2665fac83c611 = function(arg0, arg1) {
        try {
            var state0 = {a: arg0, b: arg1};
            var cb0 = (arg0, arg1) => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return __wbg_adapter_344(a, state0.b, arg0, arg1);
                } finally {
                    state0.a = a;
                }
            };
            const ret = new Promise(cb0);
            return ret;
        } finally {
            state0.a = state0.b = 0;
        }
    };
    imports.wbg.__wbg_new_2afa4873bb1cc37b = function(arg0, arg1) {
        const ret = new L.Point(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbg_new_405e22f390576ce2 = function() {
        const ret = new Object();
        return ret;
    };
    imports.wbg.__wbg_new_6caa67c5ea415b1b = function(arg0, arg1, arg2) {
        const ret = new L.Map(getStringFromWasm0(arg0, arg1), arg2);
        return ret;
    };
    imports.wbg.__wbg_new_a0295ef1047e4f0a = function(arg0) {
        const ret = new L.Icon(arg0);
        return ret;
    };
    imports.wbg.__wbg_new_b7ff62f73f4eeb97 = function(arg0, arg1) {
        const ret = new L.Popup(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbg_new_c68d7209be747379 = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_new_cde852da082413b0 = function(arg0) {
        const ret = new L.DivIcon(arg0);
        return ret;
    };
    imports.wbg.__wbg_new_fd899f461a1c9b55 = function(arg0, arg1) {
        const ret = new L.LatLng(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbg_newnoargs_105ed471475aaf50 = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_newoptions_c2bc2ae8a5fcf989 = function(arg0, arg1, arg2) {
        const ret = new L.TileLayer(getStringFromWasm0(arg0, arg1), arg2);
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_d97e637ebe145a9a = function(arg0, arg1, arg2) {
        const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithlatlng_fc8af693f5f34c51 = function(arg0, arg1) {
        const ret = new L.Popup(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbg_newwithoptions_0d6a357fe1245596 = function(arg0, arg1) {
        const ret = new L.Circle(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbg_newwithoptions_6e2e732c1e965451 = function(arg0, arg1) {
        const ret = new L.Marker(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbg_on_8c7d6c7ab79756cd = function(arg0, arg1, arg2, arg3) {
        const ret = arg0.on(getStringFromWasm0(arg1, arg2), arg3);
        return ret;
    };
    imports.wbg.__wbg_openOn_bd2de2f85010b9ef = function(arg0, arg1) {
        arg0.openOn(arg1);
    };
    imports.wbg.__wbg_parentNode_9de97a0e7973ea4e = function(arg0) {
        const ret = arg0.parentNode;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_queueMicrotask_97d92b4fcc8a61c5 = function(arg0) {
        queueMicrotask(arg0);
    };
    imports.wbg.__wbg_queueMicrotask_d3219def82552485 = function(arg0) {
        const ret = arg0.queueMicrotask;
        return ret;
    };
    imports.wbg.__wbg_random_3ad904d98382defe = function() {
        const ret = Math.random();
        return ret;
    };
    imports.wbg.__wbg_removeEventListener_056dfe8c3d6c58f9 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.removeEventListener(getStringFromWasm0(arg1, arg2), arg3);
    }, arguments) };
    imports.wbg.__wbg_remove_28974cc8e1afc469 = function(arg0) {
        const ret = arg0.remove();
        return ret;
    };
    imports.wbg.__wbg_remove_9f10fee6dc85af0e = function(arg0) {
        const ret = arg0.remove();
        return ret;
    };
    imports.wbg.__wbg_remove_e2d2659f3128c045 = function(arg0) {
        arg0.remove();
    };
    imports.wbg.__wbg_remove_efb062ab554e1fbd = function(arg0) {
        arg0.remove();
    };
    imports.wbg.__wbg_resolve_4851785c9c5f573d = function(arg0) {
        const ret = Promise.resolve(arg0);
        return ret;
    };
    imports.wbg.__wbg_respond_1f279fa9f8edcb1c = function() { return handleError(function (arg0, arg1) {
        arg0.respond(arg1 >>> 0);
    }, arguments) };
    imports.wbg.__wbg_setAttribute_2704501201f15687 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.setAttribute(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_setContent_866fea0e485a2094 = function(arg0, arg1) {
        const ret = arg0.setContent(arg1);
        return ret;
    };
    imports.wbg.__wbg_setIcon_b973794c93b78db0 = function(arg0, arg1) {
        arg0.setIcon(arg1);
    };
    imports.wbg.__wbg_setLatLng_703a08551d8226ec = function(arg0, arg1) {
        arg0.setLatLng(arg1);
    };
    imports.wbg.__wbg_setLatLng_f6484fe5277efbdb = function(arg0, arg1) {
        arg0.setLatLng(arg1);
    };
    imports.wbg.__wbg_setOpacity_63b9deacc14e619e = function(arg0, arg1) {
        arg0.setOpacity(arg1);
    };
    imports.wbg.__wbg_setProperty_f2cf326652b9a713 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.setProperty(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_setRadius_2c312d63bfa96d06 = function(arg0, arg1) {
        arg0.setRadius(arg1);
    };
    imports.wbg.__wbg_setStyle_89174a5220b7802d = function(arg0, arg1) {
        const ret = arg0.setStyle(arg1);
        return ret;
    };
    imports.wbg.__wbg_set_65595bdd868b3009 = function(arg0, arg1, arg2) {
        arg0.set(arg1, arg2 >>> 0);
    };
    imports.wbg.__wbg_set_bb8cecf6a62b9f46 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = Reflect.set(arg0, arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_setalt_3e9469345053e91a = function(arg0, arg1, arg2) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg1;
            deferred0_1 = arg2;
            arg0.alt = getStringFromWasm0(arg1, arg2);
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_setattribution_988792154344a1f4 = function(arg0, arg1, arg2) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg1;
            deferred0_1 = arg2;
            arg0.attribution = getStringFromWasm0(arg1, arg2);
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_setattribution_c34414ee161c4f64 = function(arg0, arg1, arg2) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg1;
            deferred0_1 = arg2;
            arg0.attribution = getStringFromWasm0(arg1, arg2);
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_setautoClose_9205e1bcbd51d237 = function(arg0, arg1) {
        arg0.autoClose = arg1 !== 0;
    };
    imports.wbg.__wbg_setautoPanPaddingBottomRight_7e22d0b4c1e0b06a = function(arg0, arg1) {
        arg0.autoPanPaddingBottomRight = arg1;
    };
    imports.wbg.__wbg_setautoPanPaddingTopLeft_fdc6f2a58f16f6b2 = function(arg0, arg1) {
        arg0.autoPanPaddingTopLeft = arg1;
    };
    imports.wbg.__wbg_setautoPanPadding_6a17f838fdfbdda4 = function(arg0, arg1) {
        arg0.autoPanPadding = arg1;
    };
    imports.wbg.__wbg_setautoPanPadding_874000bf32634fdf = function(arg0, arg1) {
        arg0.autoPanPadding = arg1;
    };
    imports.wbg.__wbg_setautoPanSpeed_3516dbb61137daf0 = function(arg0, arg1) {
        arg0.autoPanSpeed = arg1;
    };
    imports.wbg.__wbg_setautoPan_7b83353c74ebf6c9 = function(arg0, arg1) {
        arg0.autoPan = arg1 !== 0;
    };
    imports.wbg.__wbg_setautoPan_ad2fad14babca81e = function(arg0, arg1) {
        arg0.autoPan = arg1 !== 0;
    };
    imports.wbg.__wbg_setbubblingMouseEvents_464b089714e277a1 = function(arg0, arg1) {
        arg0.bubblingMouseEvents = arg1 !== 0;
    };
    imports.wbg.__wbg_setbubblingMouseEvents_86c023fcfaf7346f = function(arg0, arg1) {
        arg0.bubblingMouseEvents = arg1 !== 0;
    };
    imports.wbg.__wbg_setcenter_dc848d456a25e38a = function(arg0, arg1) {
        arg0.center = arg1;
    };
    imports.wbg.__wbg_setclassName_57b7affad903b198 = function(arg0, arg1, arg2) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg1;
            deferred0_1 = arg2;
            arg0.className = getStringFromWasm0(arg1, arg2);
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_setclassName_6d7afc22efe41bd6 = function(arg0, arg1, arg2) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg1;
            deferred0_1 = arg2;
            arg0.className = getStringFromWasm0(arg1, arg2);
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_setclassName_f0aafe9fb4645e46 = function(arg0, arg1, arg2) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg1;
            deferred0_1 = arg2;
            arg0.className = getStringFromWasm0(arg1, arg2);
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_setcloseButton_901f77b9b3969003 = function(arg0, arg1) {
        arg0.closeButton = arg1 !== 0;
    };
    imports.wbg.__wbg_setcloseOnClick_1d385b93e8aa45f7 = function(arg0, arg1) {
        arg0.closeOnClick = arg1 !== 0;
    };
    imports.wbg.__wbg_setcloseOnEscapeKey_e67297aa6fe6ff09 = function(arg0, arg1) {
        arg0.closeOnEscapeKey = arg1 !== 0;
    };
    imports.wbg.__wbg_setcolor_6f7ead0cab43383e = function(arg0, arg1, arg2) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg1;
            deferred0_1 = arg2;
            arg0.color = getStringFromWasm0(arg1, arg2);
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_setdashArray_506ffe7aa14a8940 = function(arg0, arg1, arg2) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg1;
            deferred0_1 = arg2;
            arg0.dashArray = getStringFromWasm0(arg1, arg2);
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_setdashOffset_db395820f47eaa60 = function(arg0, arg1, arg2) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg1;
            deferred0_1 = arg2;
            arg0.dashOffset = getStringFromWasm0(arg1, arg2);
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_setdoubleClickZoom_aa3d6e30f8b7fe52 = function(arg0, arg1) {
        arg0.doubleClickZoom = arg1;
    };
    imports.wbg.__wbg_setdraggable_6fef87cab5e4e62b = function(arg0, arg1) {
        arg0.draggable = arg1 !== 0;
    };
    imports.wbg.__wbg_setfillColor_808ac5c068fa52eb = function(arg0, arg1, arg2) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg1;
            deferred0_1 = arg2;
            arg0.fillColor = getStringFromWasm0(arg1, arg2);
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_setfillOpacity_109e949b49a45121 = function(arg0, arg1) {
        arg0.fillOpacity = arg1;
    };
    imports.wbg.__wbg_setfillRule_e41758fe14ca2b39 = function(arg0, arg1, arg2) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg1;
            deferred0_1 = arg2;
            arg0.fillRule = getStringFromWasm0(arg1, arg2);
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_setfill_d92374af00a8090b = function(arg0, arg1) {
        arg0.fill = arg1 !== 0;
    };
    imports.wbg.__wbg_seticonAnchor_02d5969150a87656 = function(arg0, arg1) {
        arg0.iconAnchor = arg1;
    };
    imports.wbg.__wbg_seticonAnchor_fcc8498c1be8bb85 = function(arg0, arg1) {
        arg0.iconAnchor = arg1;
    };
    imports.wbg.__wbg_seticonSize_a47b6068dc72094c = function(arg0, arg1) {
        arg0.iconSize = arg1;
    };
    imports.wbg.__wbg_seticonSize_fce3f68c35eb0d10 = function(arg0, arg1) {
        arg0.iconSize = arg1;
    };
    imports.wbg.__wbg_seticonUrl_f3d9e9485eb34104 = function(arg0, arg1, arg2) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg1;
            deferred0_1 = arg2;
            arg0.iconUrl = getStringFromWasm0(arg1, arg2);
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_seticon_5e30d35ec07ffc0e = function(arg0, arg1) {
        arg0.icon = arg1;
    };
    imports.wbg.__wbg_setid_d1300d55a412791b = function(arg0, arg1, arg2) {
        arg0.id = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setinnerHTML_31bde41f835786f7 = function(arg0, arg1, arg2) {
        arg0.innerHTML = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setinteractive_6aa70d1d20925af7 = function(arg0, arg1) {
        arg0.interactive = arg1 !== 0;
    };
    imports.wbg.__wbg_setinteractive_b8a698d636e1a0cc = function(arg0, arg1) {
        arg0.interactive = arg1 !== 0;
    };
    imports.wbg.__wbg_setkeepInView_d0590b510fcc500a = function(arg0, arg1) {
        arg0.keepInView = arg1 !== 0;
    };
    imports.wbg.__wbg_setkeyboard_6d062212152fe37c = function(arg0, arg1) {
        arg0.keyboard = arg1 !== 0;
    };
    imports.wbg.__wbg_setlineCap_b7658e4361459872 = function(arg0, arg1, arg2) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg1;
            deferred0_1 = arg2;
            arg0.lineCap = getStringFromWasm0(arg1, arg2);
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_setlineJoin_4ba48b49e32d2429 = function(arg0, arg1, arg2) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg1;
            deferred0_1 = arg2;
            arg0.lineJoin = getStringFromWasm0(arg1, arg2);
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_setmaxWidth_abf77c01419fe4c1 = function(arg0, arg1) {
        arg0.maxWidth = arg1;
    };
    imports.wbg.__wbg_setmaxZoom_0ad747ee63ed49e7 = function(arg0, arg1) {
        arg0.maxZoom = arg1;
    };
    imports.wbg.__wbg_setminWidth_2ec6e0cdaae1f4ff = function(arg0, arg1) {
        arg0.minWidth = arg1;
    };
    imports.wbg.__wbg_setminZoom_4de3b890f0b6dfe1 = function(arg0, arg1) {
        arg0.minZoom = arg1;
    };
    imports.wbg.__wbg_setminZoom_b969ad49e3731ad3 = function(arg0, arg1) {
        arg0.minZoom = arg1;
    };
    imports.wbg.__wbg_setnodeValue_58cb1b2f6b6c33d2 = function(arg0, arg1, arg2) {
        arg0.nodeValue = arg1 === 0 ? undefined : getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setoffset_65c4edaabbe475e2 = function(arg0, arg1) {
        arg0.offset = arg1;
    };
    imports.wbg.__wbg_setopacity_1ec826709414d899 = function(arg0, arg1) {
        arg0.opacity = arg1;
    };
    imports.wbg.__wbg_setopacity_7e645d6765957c76 = function(arg0, arg1) {
        arg0.opacity = arg1;
    };
    imports.wbg.__wbg_setpane_3bbfea144a749aa2 = function(arg0, arg1, arg2) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg1;
            deferred0_1 = arg2;
            arg0.pane = getStringFromWasm0(arg1, arg2);
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_setpane_49b282a82f382d27 = function(arg0, arg1, arg2) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg1;
            deferred0_1 = arg2;
            arg0.pane = getStringFromWasm0(arg1, arg2);
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_setpreferCanvas_d587fcdaef517706 = function(arg0, arg1) {
        arg0.preferCanvas = arg1 !== 0;
    };
    imports.wbg.__wbg_setriseOffset_124833d0f66b2339 = function(arg0, arg1) {
        arg0.riseOffset = arg1;
    };
    imports.wbg.__wbg_setriseOnHover_dff41f625109a1f8 = function(arg0, arg1) {
        arg0.riseOnHover = arg1 !== 0;
    };
    imports.wbg.__wbg_setscrollWheelZoom_e3276db9225b34cb = function(arg0, arg1) {
        arg0.scrollWheelZoom = arg1 !== 0;
    };
    imports.wbg.__wbg_setshadowPane_9d1417483811e990 = function(arg0, arg1, arg2) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg1;
            deferred0_1 = arg2;
            arg0.shadowPane = getStringFromWasm0(arg1, arg2);
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_setstroke_51e382b6e11301a1 = function(arg0, arg1) {
        arg0.stroke = arg1 !== 0;
    };
    imports.wbg.__wbg_settitle_0adf81d19495bec0 = function(arg0, arg1, arg2) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg1;
            deferred0_1 = arg2;
            arg0.title = getStringFromWasm0(arg1, arg2);
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_setweight_e7b4c7a14e8a5769 = function(arg0, arg1) {
        arg0.weight = arg1;
    };
    imports.wbg.__wbg_setzIndexOffset_cede9f57ffc7a07c = function(arg0, arg1) {
        arg0.zIndexOffset = arg1;
    };
    imports.wbg.__wbg_setzoomControl_5194bb8f60f7fbe3 = function(arg0, arg1) {
        arg0.zoomControl = arg1 !== 0;
    };
    imports.wbg.__wbg_setzoomDelta_7e2285b827ef9aae = function(arg0, arg1) {
        arg0.zoomDelta = arg1;
    };
    imports.wbg.__wbg_setzoomSnap_00a44f4eefb18369 = function(arg0, arg1) {
        arg0.zoomSnap = arg1;
    };
    imports.wbg.__wbg_setzoom_4ecab855961ce9be = function(arg0, arg1) {
        arg0.zoom = arg1;
    };
    imports.wbg.__wbg_static_accessor_GLOBAL_88a902d13a557d07 = function() {
        const ret = typeof global === 'undefined' ? null : global;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0 = function() {
        const ret = typeof globalThis === 'undefined' ? null : globalThis;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_SELF_37c5d418e4bf5819 = function() {
        const ret = typeof self === 'undefined' ? null : self;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_WINDOW_5de37043a91a9c40 = function() {
        const ret = typeof window === 'undefined' ? null : window;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_style_fb30c14e5815805c = function(arg0) {
        const ret = arg0.style;
        return ret;
    };
    imports.wbg.__wbg_target_0a62d9d79a2a1ede = function(arg0) {
        const ret = arg0.target;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_then_44b73946d2fb3e7d = function(arg0, arg1) {
        const ret = arg0.then(arg1);
        return ret;
    };
    imports.wbg.__wbg_value_91cbf0dd3ab84c1e = function(arg0, arg1) {
        const ret = arg1.value;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_view_fd8a56e8983f448d = function(arg0) {
        const ret = arg0.view;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_warn_4ca3906c248c47c4 = function(arg0) {
        console.warn(arg0);
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = arg0.original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper1029 = function(arg0, arg1, arg2) {
        const ret = makeClosure(arg0, arg1, 347, __wbg_adapter_33);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper1031 = function(arg0, arg1, arg2) {
        const ret = makeClosure(arg0, arg1, 347, __wbg_adapter_33);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper1032 = function(arg0, arg1, arg2) {
        const ret = makeClosure(arg0, arg1, 347, __wbg_adapter_33);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper1033 = function(arg0, arg1, arg2) {
        const ret = makeClosure(arg0, arg1, 347, __wbg_adapter_33);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper1034 = function(arg0, arg1, arg2) {
        const ret = makeClosure(arg0, arg1, 347, __wbg_adapter_33);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper1331 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 367, __wbg_adapter_44);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper3111 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 395, __wbg_adapter_47);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper851 = function(arg0, arg1, arg2) {
        const ret = makeClosure(arg0, arg1, 300, __wbg_adapter_28);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper853 = function(arg0, arg1, arg2) {
        const ret = makeClosure(arg0, arg1, 300, __wbg_adapter_28);
        return ret;
    };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_2;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };
    imports.wbg.__wbindgen_is_falsy = function(arg0) {
        const ret = !arg0;
        return ret;
    };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(arg0) === 'function';
        return ret;
    };
    imports.wbg.__wbindgen_is_null = function(arg0) {
        const ret = arg0 === null;
        return ret;
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = arg0 === undefined;
        return ret;
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return ret;
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        const ret = arg0;
        return ret;
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('pipeline-front_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
