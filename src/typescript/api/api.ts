import * as http from 'http'

export async function get_assets(f_type: string, a_type: string) {
    let func = "get_assets";
    let args = `{\"f_type\": \"${f_type}\", \"a_type\": \"${a_type}\"}`;

    let value = access_api(func, args);

    return value as any
}

// to do
export function get_ranking() {

}

function access_api(func: string, arg: string) {
    let url = `http://api.utohime.cc/${func}/${arg}`    

    let data = '';

    return new Promise(resolve => {
        http.get(url, (res: any) => {

            res.on('data', (chunk: any) => {
                data += chunk;
            });

            res.on('end', () => {
                let val: {} = JSON.parse(data);

                resolve(val)
            });

        }).on("error", (err: any) => {
            console.log(err.message);
        });
    })
}