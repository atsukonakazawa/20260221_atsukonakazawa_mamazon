export async function fetchAddress(postcode: string) {
    const res = await fetch(
        `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postcode}`
    );

    const data = await res.json();

    if (data.results?.length > 0) {
        const result = data.results[0];

        return (
            result.address1 +
            result.address2 +
            result.address3
        );
    }

    return null;
}