# # WritableDocument

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**date_added** | [**\DateTime**](\DateTime.md) | The server date and time when the document was finally processed and added to the system. | [optional] [readonly]
**description** | **string** | An optional short text describing a document. | [optional]
**document_type** | [**\app\App\Edms\OpenAPI\Client\Models\DocumentType**](DocumentType.md) |  | [optional]
**id** | **int** |  | [optional] [readonly]
**label** | **string** | The name of the document. | [optional]
**language** | **string** | The dominant language in the document. | [optional]
**latest_version** | [**\app\App\Edms\OpenAPI\Client\Models\DocumentVersion**](DocumentVersion.md) |  | [optional]
**url** | **string** |  | [optional] [readonly]
**uuid** | **string** | UUID of a document, universally Unique ID. An unique identifier generated for each document. | [optional] [readonly]
**versions** | **string** |  | [optional] [readonly]

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
