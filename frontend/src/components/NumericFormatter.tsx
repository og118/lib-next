import { forwardRef } from "react";
import { NumericFormatProps, NumericFormat } from "react-number-format";

interface NumericProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
  }
  
  export const NumericFormatAdapter = forwardRef<NumericFormatProps, NumericProps>(
    function NumericFormatAdapter(props, ref) {
      const { onChange, ...other } = props;
  
      return (
        <NumericFormat
          {...other}
          getInputRef={ref}
          onValueChange={(values) => {
            onChange({
              target: {
                name: props.name,
                value: values.value,
              },
            });
          }}
          thousandSeparator
          valueIsNumericString
        />
      );
    }
  );