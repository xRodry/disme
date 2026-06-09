# # DocumentType

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**delete_time_period** | **int** | Amount of time after which documents of this type in the trash will be deleted. | [optional]
**delete_time_unit** | **string** |  | [optional]
**documents_url** | **string** |  | [optional] [readonly]
**documents_count** | **string** |  | [optional] [readonly]
**id** | **int** |  | [optional] [readonly]
**label** | **string** | The name of the document type. |
**filenames** | [**\app\App\Edms\OpenAPI\Client\Models\DocumentTypeFilename[]**](DocumentTypeFilename.md) |  | [optional] [readonly]
**trash_time_period** | **int** | Amount of time after which documents of this type will be moved to the trash. | [optional]
**trash_time_unit** | **string** |  | [optional]
**url** | **string** |  | [optional] [readonly]

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
