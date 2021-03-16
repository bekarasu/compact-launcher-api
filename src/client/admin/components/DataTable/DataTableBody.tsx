import { TableRow, TableCell, TableBody, withStyles, StyledComponentProps } from '@material-ui/core'
import React from 'react'
import { IDataTableBodyProps } from '../../../../../@types/client/admin/components'
import { ITheme } from '../../../../../@types/client/admin/theme'
import { trans } from '../../../../common/resources/lang/translate'
import ActionMenu from '../form/ActionMenu'

class DataTableBody extends React.Component<IDataTableBodyProps & StyledComponentProps> {
  render() {
    return (
      <TableBody>
        {this.props.fetching ? (
          <TableRow>
            <TableCell>
              <strong>{trans('resource.fetching')}</strong>
            </TableCell>
          </TableRow>
        ) : this.props.items.length > 0 ? (
          this.props.items.map((item, key) => (
            <TableRow key={key} className={key % 2 === 0 ? this.props.classes.row : null}>
              {/** we are theming each even row */}
              <>
                {this.props.fields.map((field, index) => {
                  return (
                    <TableCell key={index} align="center" className={key % 2 === 0 ? this.props.classes.row : null}>
                      {item[field] != null && !Array.isArray(item[field]) && typeof item[field] !== 'object' && item[field]}
                    </TableCell>
                  )
                })}
                <TableCell align="center" size="small" padding="none">
                  <ActionMenu url={this.props.resourceURL + '/' + item._id} actions={this.props.actions} actionResult={this.props.actionResult} />
                </TableCell>
              </>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell>
              <strong>{trans('resource.dataNotFound')}</strong>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    )
  }
}

const styles = (theme: ITheme) => ({
  row: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.third.contrastText,
  },
})

export default withStyles(styles)(DataTableBody)

// export default DataTableBody;
