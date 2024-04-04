// Fetch Function
export const myFetch = async (url, options = null) => {
    // deklarerer response variabel
    let response;

    //forsøger at lave et kald
    try {
        //hvis options er null skal den kun bruge url
        if (!options) {
            response = await fetch(url);
            //ellers skal den bruge både url og options
        } else {
            response = await fetch(url, options);
        }
        //laver en parse på response 
        const result = await response.json();
        //gemmer response info i object key response
        result.response = {
            ok: response.ok,
            status: response.status,
            statusText: response.statusText
        }
        //retuner result
        return result;
    }
    //fanger evt fejl i fetch
    catch (err) {
        console.error(`Der er fejl i myFetch: ${err}`);
    }
}