# # IndexTemplateNodeWrite

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**children** | [**\App\Edms\OpenAPI\Client\Models\IndexTemplateNodeWrite[]**](IndexTemplateNodeWrite.md) |  | [optional]
**enabled** | **bool** | Causes this node to be visible and updated when document data changes. | [optional]
**expression** | **string** | Enter a template to render. Use Django&#39;s default templating language (https://docs.djangoproject.com/en/1.11/ref/templates/builtins/) |
**id** | **int** |  | [optional] [readonly]
**index** | **int** |  | [optional] [readonly]
**index_url** | **string** |  | [optional] [readonly]
**level** | **int** |  | [optional] [readonly]
**link_documents** | **bool** | Check this option to have this node act as a container for documents and not as a parent for further nodes. | [optional]
**parent** | **int** |  | [optional]
**parent_url** | **string** |  | [optional] [readonly]
**url** | **string** |  | [optional] [readonly]

[[Back to Model list]](../../README.md#models) [[Back to API list]](../../README.md#endpoints) [[Back to README]](../../README.md)
