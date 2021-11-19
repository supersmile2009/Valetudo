import React, {FunctionComponent} from "react";
import {FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup, Typography} from "@mui/material";
import {
    Capability,
    CarpetAvoidanceMode,
    StatusState,
    useCarpetAvoidanceModesQuery,
    useCarpetAvoidanceModeMutation,
    useCurrentCarpetAvoidanceModeQuery,
    useRobotStatusQuery,
} from "../../api";
import {useCapabilitiesSupported} from "../../CapabilitiesProvider";
import {CapabilityItem} from "./CapabilityLayout";


const renderRadioButtons = (
    isError: boolean,
    loading: boolean,
    isDisabled: boolean,
    value: string,
    choiceOptions: RadioButtonEntry[],
    label: string,
    disabledMsg: string,
    onChange: (enabled: string) => void,
    capability: Capability
) => {

    if (isError) {
        return (
            <Typography variant="body2" color="error">
                Error loading controls for {capability}
            </Typography>
        );
    }

    const renderSubtitleBlock = (): JSX.Element | null => {
        if (isDisabled && disabledMsg !== "") {
            return (
                <Typography variant="body2" color="textSecondary">
                    {disabledMsg}
                </Typography>
            );
        }
        return null;
    };
    const radios: JSX.Element[] = [];
    choiceOptions.forEach((option) => {
        radios.push(
            <FormControlLabel
                value={option.value}
                label={option.label}
                disabled={loading || isDisabled}
                control={<Radio/>}
                key={`label-${option.value}`}
            />
        );
        if (option.description !== "") {
            radios.push(<FormHelperText key={`description-${option.value}`}>{option.description}</FormHelperText>);
        }
    });

    return (
        <>
            <FormLabel component="legend">{label}</FormLabel>
            {renderSubtitleBlock()}
            <RadioGroup
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                }}
            >
                {radios}
            </RadioGroup>
        </>
    );
};


export interface ChoiceListProps<T extends SupportedCapabilitiesDisplayProps> {
    capability: T;
    label: string;
    disabledMsg: string;
    enabledOnStatuses: StatusState["value"][];
    displayProps: PresetDisplayPropsMap[T];
}


const ChoiceListControl = (props: ChoiceListProps<any>): JSX.Element => {
    const { label, disabledMsg, enabledOnStatuses, displayProps } = props;
    const { data: status } = useRobotStatusQuery((state) => {
        return state.value;
    });
    const {
        data: currentSelection,
        isFetching: isFetchingSelection,
        isError: isCurrentSelectionError
    } = useCurrentCarpetAvoidanceModeQuery();
    const {
        isLoading: isPresetsLoading,
        isError: isPresetsLoadError,
        data: presets,
    } = useCarpetAvoidanceModesQuery();
    const {
        mutate: onChange,
        isLoading: isChanging
    } = useCarpetAvoidanceModeMutation();

    const disabled = !(status !== undefined && enabledOnStatuses.includes(status));
    const loading = isFetchingSelection || isPresetsLoading || isChanging;
    const errored = isCurrentSelectionError || isPresetsLoadError;

    const choiceOptions: RadioButtonEntry[] = React.useMemo((): RadioButtonEntry[] => {
        return presets?.map((value): RadioButtonEntry => {
            return {
                value: value,
                ...displayProps[value],
            };
        }) ?? [];
    }, [presets, displayProps]);


    return renderRadioButtons(
        errored,
        loading,
        disabled,
        currentSelection?.value || "",
        choiceOptions,
        label,
        disabledMsg,
        onChange,
        Capability.CarpetAvoidanceModeControl
    );
};

const CarpetSettings: FunctionComponent = () => {
    const [
        carpetAvoidanceModeControl,
    ] = useCapabilitiesSupported(
        Capability.CarpetAvoidanceModeControl,
    );

    return (
        <CapabilityItem title={"Carpet Settings"}>
            {carpetAvoidanceModeControl && <ChoiceListControl
                capability={Capability.CarpetAvoidanceModeControl}
                label="Carpet Avoidance Mode"
                displayProps={CARPET_AVOIDANCE_MODES_DISPLAY_PROPS}
                disabledMsg="Robot must be docked or idle in order to change this setting."
                enabledOnStatuses={["docked", "idle"]}
            />}
        </CapabilityItem>
    );
};


interface RadioButtonEntry {
    value: string;
    label: string;
    description: string;
}

type PresetDisplayProps<T extends string> = {
    [key in T]: {
        label: string,
        description: string
    }
}

type PresetDisplayPropsMap = {
    [Capability.CarpetAvoidanceModeControl]: PresetDisplayProps<CarpetAvoidanceMode["value"]>,
}

type SupportedCapabilitiesDisplayProps = keyof PresetDisplayPropsMap;

const CARPET_AVOIDANCE_MODES_DISPLAY_PROPS: PresetDisplayProps<CarpetAvoidanceMode["value"]> = {
    avoid: {
        label: "Avoid",
        description: "Suitable for low to medium pile carpets. When the mop bracket is attached, the robot will avoid carpets altogether.",
    },
    raise: {
        label: "Raise the mop",
        description: "Suitable for low pile carpets or mats. When the mop attachment is installed, the robot will lift the mopping module and vacuum the carpet.",
    },
    ignore: {
        label: "Ignore",
        description: "Suitable for environments where there are no carpets or where mats can be mopped (i.e. rubber mats).",
    },
};

export default CarpetSettings;
