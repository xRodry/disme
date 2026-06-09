# # WorkflowTransitionField

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**field_type** | **int** |  |
**name** | **string** | The name that will be used to identify this field in other parts of the workflow system. |
**help_text** | **string** | An optional message that will help users better understand the purpose of the field and data to provide. | [optional]
**id** | **int** |  | [optional] [readonly]
**label** | **string** | The field name that will be shown on the user interface. |
**required** | **bool** | Whether this fields needs to be filled out or not to proceed. | [optional]
**url** | **string** |  | [optional] [readonly]
**widget** | **int** | An optional class to change the default presentation of the field. | [optional]
**widget_kwargs** | **string** | A group of keyword arguments to customize the widget. Use YAML format. | [optional]
**workflow_transition_url** | **string** |  | [optional] [readonly]

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
