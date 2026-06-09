# OpenAPI\Client\RolesApi

All URIs are relative to http://localhost:1234/api.

Method | HTTP request | Description
------------- | ------------- | -------------
[**rolesCreate()**](RolesApi.md#rolesCreate) | **POST** /roles/ | 
[**rolesDelete()**](RolesApi.md#rolesDelete) | **DELETE** /roles/{id}/ | 
[**rolesList()**](RolesApi.md#rolesList) | **GET** /roles/ | 
[**rolesPartialUpdate()**](RolesApi.md#rolesPartialUpdate) | **PATCH** /roles/{id}/ | 
[**rolesRead()**](RolesApi.md#rolesRead) | **GET** /roles/{id}/ | 
[**rolesUpdate()**](RolesApi.md#rolesUpdate) | **PUT** /roles/{id}/ | 


## `rolesCreate()`

```php
rolesCreate($data): \app\App\Edms\OpenAPI\Client\Models\WritableRole
```



Create a new role.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiRolesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$data = new \app\App\Edms\OpenAPI\Client\Models\WritableRole(); // \app\App\Edms\OpenAPI\Client\Models\WritableRole

try {
    $result = $apiInstance->rolesCreate($data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling RolesApi->rolesCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WritableRole**](../Model/WritableRole.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WritableRole**](../Model/WritableRole.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `rolesDelete()`

```php
rolesDelete($id)
```



Delete the selected role.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiRolesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Role.

try {
    $apiInstance->rolesDelete($id);
} catch (Exception $e) {
    echo 'Exception when calling RolesApi->rolesDelete: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Role. |

### Return type

void (empty response body)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `rolesList()`

```php
rolesList($page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse20036
```



Returns a list of all the roles.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiRolesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->rolesList($page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling RolesApi->rolesList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse20036**](../Model/InlineResponse20036.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `rolesPartialUpdate()`

```php
rolesPartialUpdate($id, $data): \app\App\Edms\OpenAPI\Client\Models\WritableRole
```



Edit the selected role.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiRolesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Role.
$data = new \app\App\Edms\OpenAPI\Client\Models\WritableRole(); // \app\App\Edms\OpenAPI\Client\Models\WritableRole

try {
    $result = $apiInstance->rolesPartialUpdate($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling RolesApi->rolesPartialUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Role. |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WritableRole**](../Model/WritableRole.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WritableRole**](../Model/WritableRole.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `rolesRead()`

```php
rolesRead($id): \app\App\Edms\OpenAPI\Client\Models\Role
```



Return the details of the selected role.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiRolesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Role.

try {
    $result = $apiInstance->rolesRead($id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling RolesApi->rolesRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Role. |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\Role**](../Model/Role.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `rolesUpdate()`

```php
rolesUpdate($id, $data): \app\App\Edms\OpenAPI\Client\Models\WritableRole
```



Edit the selected role.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiRolesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Role.
$data = new \app\App\Edms\OpenAPI\Client\Models\WritableRole(); // \app\App\Edms\OpenAPI\Client\Models\WritableRole

try {
    $result = $apiInstance->rolesUpdate($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling RolesApi->rolesUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Role. |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WritableRole**](../Model/WritableRole.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WritableRole**](../Model/WritableRole.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
