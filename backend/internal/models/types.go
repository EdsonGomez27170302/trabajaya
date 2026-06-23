package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
)

type JSONStringArrayMap map[string][]string

func (m JSONStringArrayMap) Value() (driver.Value, error) {
	if m == nil {
		return "{}", nil
	}
	return json.Marshal(m)
}

func (m *JSONStringArrayMap) Scan(value interface{}) error {
	if value == nil {
		*m = JSONStringArrayMap{}
		return nil
	}

	bytes, ok := value.([]byte)
	if !ok {
		if str, ok := value.(string); ok {
			bytes = []byte(str)
		} else {
			return errors.New("failed to scan JSONStringArrayMap: unsupported type")
		}
	}

	result := JSONStringArrayMap{}
	if len(bytes) > 0 {
		if err := json.Unmarshal(bytes, &result); err != nil {
			return err
		}
	}
	*m = result
	return nil
}
