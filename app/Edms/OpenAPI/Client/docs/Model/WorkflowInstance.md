# # WorkflowInstance

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**current_state** | [**\app\App\Edms\OpenAPI\Client\Models\WorkflowState**](WorkflowState.md) |  | [optional]
**document_workflow_url** | **string** | API URL pointing to a workflow in relation to the document to which it is attached. This URL is different than the canonical workflow URL. | [optional] [readonly]
**last_log_entry** | [**\app\App\Edms\OpenAPI\Client\Models\WorkflowInstanceLogEntry**](WorkflowInstanceLogEntry.md) |  | [optional]
**log_entries_url** | **string** | A link to the entire history of this workflow. | [optional] [readonly]
**transition_choices** | [**\app\App\Edms\OpenAPI\Client\Models\WorkflowTransition[]**](WorkflowTransition.md) |  | [optional] [readonly]
**workflow** | [**\app\App\Edms\OpenAPI\Client\Models\Workflow**](Workflow.md) |  | [optional]

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
