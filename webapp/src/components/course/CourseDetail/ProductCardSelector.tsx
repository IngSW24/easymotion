import React from "react";
import { Card, CardContent, Box, Typography } from "@mui/material";
import Selector from "../../editors/Selector/Selector";

export interface ProductCardSelectorProps<T extends string> {
  label: string;
  icon: React.ReactElement;
  options: LiteralUnionDescriptor<T>;
  value: T;
  onChange: (value: T) => void;
  isEdit?: boolean;
}

export default function ProductCardSelector<T extends string>(
  props: ProductCardSelectorProps<T>
) {
  const { label, options, value, onChange, icon, isEdit = false } = props;

  return (
    <Card
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "center",
        px: 1,
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: "rgba(116, 116, 116, 0.24)",
      }}
    >
      <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}>
        {icon}
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {!isEdit && (
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
          )}
          {isEdit ? (
            <Selector<T>
              initialValue={value}
              label={label}
              options={options}
              onChange={onChange}
            />
          ) : (
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              {options.find((o) => o.value === value)?.label ?? value}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
