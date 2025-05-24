import { JSX, useState } from 'react';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface DropdownListProps<T> {
    values: T[];
    getLabel: (item: T) => string;
    onSelect: (value: T) => void;
    label?: string;
}

export function DropdownList<T,>(props: DropdownListProps<T>): JSX.Element {
    const { values, getLabel, onSelect, label = 'Select' } = props;
    const [selectedValue, setSelectedValue] = useState<T>(values[0]);

    const handleChange = (event: SelectChangeEvent<string>) => {
        const selectedItem = values.find(item => getLabel(item) === event.target.value);
        if (selectedItem) {
            setSelectedValue(selectedItem);
            onSelect(selectedItem);
        }
    };

    return (
        <Box sx={{ maxWidth: 300, mb: 2 }}>
            <FormControl fullWidth>
                <InputLabel id="dropdown-list-label">{label}</InputLabel>
                <Select
                    labelId="dropdown-list-label"
                    id="dropdown-list"
                    value={getLabel(selectedValue)}
                    label={label}
                    onChange={handleChange}
                >
                    {values.map((item, index) => (
                        <MenuItem key={index} value={getLabel(item)}>
                            {getLabel(item)}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}
