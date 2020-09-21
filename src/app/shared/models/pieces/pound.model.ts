import { ChessPieceColor } from '../interfaces/piece-color.model';
import { ChessPiece } from '../piece.model';
import { PiecePosition, PositionRowPiece } from '../interfaces/position.model';
import { PieceInterface } from '../interfaces/piece.interface';
import { ChessBoard } from '../board.model';

export class PoundPiece extends ChessPiece implements PieceInterface {
  constructor(position: PiecePosition, color: ChessPieceColor) {
    super(position, color);
    this._type = 'pound';
    if (this._color === 'white') {
      this._img = 'white_pound';
    } else if (this._color === 'black') {
      this._img = 'black_pound';
    }
  }

  /**
   * Get all the available movement for the pound
   * Note: The pound can only move forward 1 case by default, the exception for his first move
   * where he can move 2 case forward. He can also attack other pieces only in diagonal.
   * @param currentBoard
   */
  public getAvailableMovement(currentBoard: ChessBoard): PiecePosition[] {
    const availableMovement: PiecePosition[] = this.getDefaultMovementPound(
      currentBoard
    );
    return availableMovement.concat(this.getMovementAttack(currentBoard));
  }

  private getDefaultMovementPound(currentBoard: ChessBoard) {
    const availableMovement: PiecePosition[] = [];
    const position = {
      ...this.position,
      row: (this.position.row +
        (this.color === 'white' ? 1 : -1)) as PositionRowPiece,
    };
    if (!currentBoard.hasPieceInPosition(position)) {
      availableMovement.push(position);
      const firstMovement = {
        ...this.position,
        row: (this.position.row +
          (this.color === 'white' ? 2 : -2)) as PositionRowPiece,
      };
      if (
        ((this.position.row === 2 && this.color === 'white') ||
          (this.position.row === 7 && this.color === 'black')) &&
        !currentBoard.hasPieceInPosition(firstMovement)
      ) {
        availableMovement.push(firstMovement);
      }
    }
    return availableMovement;
  }

  private getMovementAttack(currentBoard: ChessBoard): PiecePosition[] {
    const availableMovement = [];
    const positionAttackLeft = {
      column: PiecePosition.getColumnByModifier(this.position.column, -1),
      row: (this.position.row +
        (this.color === 'white' ? 1 : -1)) as PositionRowPiece,
    };
    const positionAttackRight = {
      column: PiecePosition.getColumnByModifier(this.position.column, 1),
      row: (this.position.row +
        (this.color === 'white' ? 1 : -1)) as PositionRowPiece,
    };
    const otherPieceLeft = currentBoard.getPieceInPosition(positionAttackLeft);
    const otherPieceRight = currentBoard.getPieceInPosition(
      positionAttackRight
    );
    if (otherPieceLeft !== undefined && otherPieceLeft.color !== this.color) {
      availableMovement.push(positionAttackLeft);
    }
    if (otherPieceRight !== undefined && otherPieceRight.color !== this.color) {
      availableMovement.push(positionAttackRight);
    }
    return availableMovement;
  }
}
