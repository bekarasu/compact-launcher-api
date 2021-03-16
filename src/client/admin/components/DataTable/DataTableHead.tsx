import { TableHead, TableRow, TableCell } from '@material-ui/core'
import React from 'react'
import { IDataTableHeadProps } from '../../../../../@types/client/admin/components'
import { trans } from '../../../../common/resources/lang/translate'

class DataTableHead extends React.Component<IDataTableHeadProps> {
  render() {
    return (
      <TableHead>
        <TableRow>
          {!this.props.fetching && this.props.items.length > 0 && (
            <>
              {this.props.fields.map((field: string) => {
                return (
                  <TableCell key={field} align="center">
                    <strong>{trans('db.' + field) != '' ? trans('db.' + field) : field.toUpperCase()}</strong>
                  </TableCell>
                )
              })}
              <TableCell align="center" size="small" padding="none">
                <strong>{trans('resource.actions')}</strong>
              </TableCell>
            </>
          )}
        </TableRow>
      </TableHead>
    )
  }
}

export default DataTableHead
