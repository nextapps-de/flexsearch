const profiles = [];
let profile;

export function profile_start(key){

    (profile[key] || (profile[key] = {

        /** @export */ time: 0,
        /** @export */ count: 0,
        /** @export */ ops: 0,
        /** @export */ nano: 0

    })).ops = (typeof performance === "undefined" ? Date : performance).now();
}

export function profile_end(key){

    const current = profile[key];

    current.time += (typeof performance === "undefined" ? Date : performance).now() - current.ops;
    current.count++;
    current.ops = 1000 / current.time * current.count;
    current.micro = current.time / current.count * 1000;
}

if(PROFILER){

    if(typeof window !== "undefined") {

        /** @export */
        window.stats = profiles;
    }
}