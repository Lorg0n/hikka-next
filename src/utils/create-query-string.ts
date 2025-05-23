/**
 * Creates or updates a URL query string by modifying the provided URLSearchParams object
 *
 * @param name - The parameter name to set or update in the query string
 * @param value - The value(s) to set. Can be a single value, array of values, or boolean
 * @param params - Existing URLSearchParams object to modify
 * @returns The updated URLSearchParams object
 *
 * @example
 * // Set a simple parameter
 * const params = new URLSearchParams();
 * createQueryString('page', '2', params); // returns params with ?page=2
 *
 * @example
 * // Set multiple values for the same parameter
 * const params = new URLSearchParams();
 * createQueryString('tag', ['anime', 'action'], params); // returns params with ?tag=anime&tag=action
 *
 * @example
 * // Remove a parameter by passing a falsy value
 * const params = new URLSearchParams('page=2');
 * createQueryString('page', false, params); // returns params with empty query string
 */
const createQueryString = (
    name: string,
    value: string | number | string[] | number[] | boolean | null | undefined,
    params: URLSearchParams,
): URLSearchParams => {
    // Handle removal case - delete the parameter if value is falsy
    if (!value && value !== 0) {
        params.delete(name);
        return params;
    }

    // Handle array values - add multiple entries with the same name
    if (Array.isArray(value)) {
        params.delete(name);
        value.forEach((item) => {
            if (item !== undefined && item !== null) {
                params.append(name, String(item));
            }
        });
        return params;
    }

    // Handle single values - convert to string and set
    params.set(name, String(value));
    return params;
};

export default createQueryString;
