function TextInputWithLabel({
    elementId,
    labelText,
    onChange,
    ref,
    value,
    maxLength,
}) {

    return (
        <>
            <label htmlFor={elementId}>{labelText}</label>
            <input
                type="text"
                id={elementId}
                ref={ref}
                value={value}
                onChange={onChange}
                maxLength={maxLength}
            />
        </>
    )
}

export default TextInputWithLabel;